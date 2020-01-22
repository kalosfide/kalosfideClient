import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { mergeMap, switchMap, concatMap, tap, map } from 'rxjs/operators';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ApiContexteCommande, CommanderStock } from './commander';
import { ApiCommande, ApiDétailCommande } from 'src/app/commandes/api-commande';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { CommandeService } from 'src/app/commandes/commande.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { CommanderUtile } from './commander-utile';
import { Site } from 'src/app/modeles/site/site';
import { ModeAction } from 'src/app/commandes/condition-action';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ClientPages, ClientRoutes } from '../client-pages';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Produit } from 'src/app/modeles/catalogue/produit';

@Injectable({
    providedIn: 'root'
})
export class CommanderService extends CommandeService {

    controllerUrl = 'commande';

    protected _stockage: Stockage<CommanderStock>;
    actionSiErreur: (groupe: KfGroupe) => void = this._actionSiErreur;

    private _stockChargéSubject: Subject<CommanderStock>;
    private _stockChargé: CommanderStock;

    constructor(
        private _catalogueService: CatalogueService,
        _stockageService: StockageService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this._stockage = _stockageService.nouveau<CommanderStock>('Commander', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
        this.créeUtile();
        this._stockChargéSubject = new Subject<CommanderStock>();
        this.redirigeSiErreur400 = () => [{ code: 'etatChange', traite: (() => this.siErreurEtatChangé()).bind(this) }];
    }

    protected get transformeSiteFnc(): (site: Site) => ModeAction {
        return (site: Site) => {
            if (!site) {
                return ModeAction.aucun;
            }
            return site.etat === IdEtatSite.ouvert
                ? ModeAction.edite
                : ModeAction.aperçu;
        };
    }

    /// implémente ICommandeService
    get service(): CommandeService { return this; }


    protected _créeUtile() {
        this._utile = new CommanderUtile(this);
    }
    get utile(): CommanderUtile {
        return this._utile as CommanderUtile;
    }

    /// SECTION Surcharges de CommandeService


    litStock(): CommanderStock {
        const stock = this._stockage.litStock();
        if (stock) {
            return new CommanderStock(stock.keySite, stock.keyIdentifiant, stock.contexte, stock.commande, stock.catalogue);
        }
    }
    fixeStock(stock: CommanderStock) {
        this._stockage.fixeStock(stock);
    }
    commandeStockée(stock: CommanderStock, ikeyClient: IKeyUidRno): ApiCommande {
        if (!ikeyClient || KeyUidRno.compareKey(stock.keyIdentifiant, ikeyClient)) {
            return stock.commande;
        }
    }
    stockeCommande(stock: CommanderStock, commande: ApiCommande) {
        stock.commande = commande;
    }
    déstockeCommande(stock: CommanderStock, ikeyCommande: IKeyUidRnoNo) {
        stock.commande = undefined;
    }

    /// FIN SECTION Surcharges de CommandeService

    /// SECTION Observables du stock

    /**
     * Avant la redirection d'un lien, on vérifie le contexte. Si changé, on recharge les éléments nécessaires du stock
     * et on redirige vers la page Bon. Si c'est la page active, on emet un observable pour qu'elle recharge le stock.
     *
     * Resolver page Bon
     * Si la propriété stockChargé est définie, retourne ce stock et supprime la propriété
     * Sinon, charge et vérifie le contexte et, si changé, recharge les éléments nécessaires. Retourne le stock
     *
     * Resolver autre page
     * Charge et vérifie le contexte et, si changé, recharge les éléments nécessaires du stock
     * Fixe une propriété stockChargé égale au stock ancien ou rechargé
     * Si le contexte n'a pas changé, retourne ce stock
     * Si le contexte a changé, redirige vers la page Bon
     * Si déjà sur la page Bon, le Resolver et ngOnInit ne sont pas appelés
     *
     * Si une action retourne l'erreur EtatChangé
     * Charge le contexte et les éléments nécessaires du stock
     * Fixe une propriété stockChargé
     * Redirige vers la page Bon
     *
     * Si déjà sur la page Bon, le Resolver et ngOnInit ne sont pas appelés
     * Il faut que le component souscrive à un observable qui emet quand stockChargé est fixé
     */

    stockChargéObs(): Observable<CommanderStock> {
        return this._stockChargéSubject.asObservable();
    }

    private _litApiContexte$(keyClient: IKeyUidRno): Observable<ApiContexteCommande> {
        const apiResult$ =
            this.get<ApiContexteCommande>(ApiController.commande, ApiAction.commande.contexte, KeyUidRno.créeParams(keyClient));
        return this.objet<ApiContexteCommande>(apiResult$);
    }

    private _litApiCommande$(keyClient: IKeyUidRno): Observable<ApiCommande> {
        const apiResult$ = this.get<ApiCommande>(ApiController.commande, ApiAction.commande.encours, KeyUidRno.créeParams(keyClient));
        return this.objet<ApiCommande>(apiResult$);
    }

    chargeEtVérifie(mêmeSiPasChangé?: 'mêmeSiPasChangé'): Observable<{
        stock: CommanderStock,
        changé: boolean,
        siteChangé?: Site
    }> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };

        return this._litApiContexte$(keyIdentifiant).pipe(
            concatMap((contexte: ApiContexteCommande) => {
                let nouveau: CommanderStock;
                const stock = this.litStock();
                let changé: boolean;
                let siteChangé: Site;
                if (site.etat !== contexte.etatSite) {
                    site.etat = contexte.etatSite;
                    changé = true;
                    siteChangé = site;
                } else {
                    changé = mêmeSiPasChangé !== undefined
                        || !stock
                        || stock.contexte.noDC !== contexte.noDC // numéro de commande changé
                        || stock.contexte.noLivraison !== contexte.noLivraison // numéro de livraison changé
                        || stock.contexte.dateCatalogue !== contexte.dateCatalogue; // date du catalogue changé
                }

                if (!contexte.noDC) {
                    // le client n'a jameis commandé
                    if (changé) {
                        nouveau = new CommanderStock(site, keyIdentifiant, contexte, null);
                        return this._catalogueService.catalogueDisponibles$().pipe(
                            mergeMap(catalogue => {
                                nouveau.catalogue = catalogue;
                                return of({ stock: nouveau, changé: true, siteChangé: siteChangé });
                            })
                        );
                    }
                } else {
                    // il y a une dernière commande
                    if (changé) {
                        return this._litApiCommande$(keyIdentifiant).pipe(
                            concatMap((apiCommande: ApiCommande) => {
                                nouveau = new CommanderStock(site, keyIdentifiant, contexte, apiCommande);
                                return this._catalogueService.catalogueDisponibles$().pipe(
                                    mergeMap(catalogue => {
                                        nouveau.catalogue = catalogue;
                                        return of({ stock: nouveau, changé: true, siteChangé: siteChangé });
                                    })
                                );
                            })
                        );
                    } else {
                        if (!stock.catalogue) {
                            // la dernière commande est la première du client et vient juste d'être créée
                            return this._catalogueService.catalogueDisponibles$().pipe(
                                mergeMap(catalogue => {
                                    stock.catalogue = catalogue;
                                    return of({ stock: stock, changé: true, siteChangé: siteChangé });
                                })
                            );
                        }
                    }
                }
                return of({ stock: stock, changé: false, siteChangé: siteChangé });
            }));
    }

    metAJourSitesStockés(site: Site) {
        if (site) {
            this.navigation.fixeSiteEnCours(site);
            this.identification.fixeSiteIdentifiant(site);
        }
    }

    /**
     * Si la page est atteinte parce que la garde a redirigé, le stock est à jour
     */
    résoudPageBon(): CommanderStock | Observable<CommanderStock> {
        if (this._stockChargé) {
            const stock = this._stockChargé;
            this.fixeStock(stock);
            this._stockChargé = undefined;
            return stock;
        } else {
            return this.chargeEtVérifie().pipe(
                map((stockChargé: {
                    stock: CommanderStock,
                    changé: boolean,
                    siteChangé?: Site
                }) => {
                    this.fixeStock(stockChargé.stock);
                    this.metAJourSitesStockés(stockChargé.siteChangé);
                    return stockChargé.stock;
                })
            );
        }
    }

    gardeAutrePage(): Observable<boolean> {
        return this.chargeEtVérifie().pipe(
            map((stockChangé: {
                stock: CommanderStock,
                changé: boolean,
                siteChangé?: Site
            }) => {
                if (stockChangé.changé) {
                    this.fixeStock(stockChangé.stock);
                    this._stockChargé = stockChangé.stock;
                    this._stockChargéSubject.next(stockChangé.stock);
                    // après stockChargé
                    this.metAJourSitesStockés(stockChangé.siteChangé);
                    this.routeur.navigueUrlDef(this.utile.url.commande());
                }
                return !stockChangé.changé;
            })
        );
    }

    /**
     * La garde a laissé passer donc le stock est à jour
     */
    résoudAutrePage(): CommanderStock | Observable<CommanderStock> {
        return this.litStock();
    }

    /**
     * La garde a laissé passer donc le stock est à jour
     */
    résoudProduit(noString: string): Produit {
        const stock = this.litStock();
        const produit: Produit = this.produit(stock, noString);
        if (produit) {
            return produit;
        }
        this.routeur.navigueUrlDef(this.utile.url.commande());
    }

    siErreurEtatChangé(): void {
        const subscription = this.chargeEtVérifie('mêmeSiPasChangé').subscribe(
            (stockChangé: {
                stock: CommanderStock,
                changé: boolean,
                siteChangé?: Site
            }) => {
                subscription.unsubscribe();
                this.fixeStock(stockChangé.stock);
                this._stockChargé = stockChangé.stock;
                this._stockChargéSubject.next(stockChangé.stock);
                this.metAJourSitesStockés(stockChangé.siteChangé);
                this.routeur.navigueUrlDef(this.utile.url.commande());
            });
    }

    private _vérifieStock$(contexte: ApiContexteCommande, site: Site, keyIdentifiant: IKeyUidRno): Observable<{
        stock: CommanderStock,
        changé: boolean
    }> {
        const stock = this.litStock();
        let nouveau: CommanderStock;
        let changé: boolean;
        if (site.etat !== contexte.etatSite) {
            site.etat = contexte.etatSite;
            this.navigation.fixeSiteEnCours(site);
            this.identification.fixeSiteIdentifiant(site);
            changé = true;
        } else {
            changé = !stock
                || !KeyUidRno.compareKey(stock.keySite, site) // site changé
                || !KeyUidRno.compareKey(stock.keyIdentifiant, keyIdentifiant) // identifiant changé
                || stock.contexte.noLivraison !== contexte.noLivraison // numéro de livraison changé
                || stock.contexte.etatSite !== contexte.etatSite // état du site changé
                || stock.contexte.dateCatalogue !== contexte.dateCatalogue; // date du catalogue changé
        }

        if (!contexte.noDC) {
            // le client n'a jameis commandé
            if (changé) {
                nouveau = new CommanderStock(site, keyIdentifiant, contexte, null);
                return this._catalogueService.catalogueDisponibles$().pipe(
                    mergeMap(catalogue => {
                        nouveau.catalogue = catalogue;
                        return of({ stock: nouveau, changé: true });
                    })
                );
            }
        } else {
            // il y a une dernière commande
            if (changé) {
                return this._litApiCommande$(keyIdentifiant).pipe(
                    concatMap((apiCommande: ApiCommande) => {
                        nouveau = new CommanderStock(site, keyIdentifiant, contexte, apiCommande);
                        return this._catalogueService.catalogueDisponibles$().pipe(
                            mergeMap(catalogue => {
                                nouveau.catalogue = catalogue;
                                return of({ stock: nouveau, changé: true });
                            })
                        );
                    })
                );
            } else {
                if (!stock.catalogue) {
                    // la dernière commande est la première du client et vient juste d'être créée
                    return this._catalogueService.catalogueDisponibles$().pipe(
                        mergeMap(catalogue => {
                            stock.catalogue = catalogue;
                            return of({ stock: stock, changé: true });
                        })
                    );
                }
            }
        }
        return of({ stock: stock, changé: false });
    }

    public apiContexte$(): Observable<ApiContexteCommande> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyClient = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };
        const apiResult$ =
            this.get<ApiContexteCommande>(ApiController.commande, ApiAction.commande.contexte, KeyUidRno.créeParams(keyClient));
        return this.objet<ApiContexteCommande>(apiResult$);
    }

    public effaceStockSiContexteChangé(contexte: ApiContexteCommande, site: Site): boolean {
        const identifiant = this.identification.litIdentifiant();
        const keyClient = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };
        const stock = this.litStock();
        if (stock) {
            let changé: boolean;
            if (site.etat !== contexte.etatSite) {
                site.etat = contexte.etatSite;
                this.navigation.fixeSiteEnCours(site);
                this.identification.fixeSiteIdentifiant(site);
                changé = true;
            } else {
                changé = !stock
                    || !KeyUidRno.compareKey(stock.keySite, site) // site changé
                    || !KeyUidRno.compareKey(stock.keyIdentifiant, keyClient) // identifiant changé
                    || stock.contexte.noLivraison !== contexte.noLivraison // numéro de livraison changé
                    || stock.contexte.etatSite !== contexte.etatSite // état du site changé
                    || stock.contexte.dateCatalogue !== contexte.dateCatalogue; // date du catalogue changé
            }
            if (changé) {
                this._stockage.initialise();
            }
            return changé;
        }
    }

    /**
     * appelé par les resolvers de accueil et bon
     */
    stock$(): Observable<CommanderStock> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };

        const contexte$ = this._litApiContexte$(keyIdentifiant);
        const stockChangé$ = contexte$.pipe(
            concatMap((contexte: ApiContexteCommande) => this._vérifieStock$(contexte, site, keyIdentifiant))
        );
        const stock$ = stockChangé$.pipe(
            switchMap(stockChangé => {
                const stock = stockChangé.stock;
                if (stockChangé.changé) {
                    this._stockage.fixeStock(stock);
                }
                return of(stock);
            })
        );

        return stock$;
    }

    /// FIN SECTION Observables du stock

    // API

    private _paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        const stock = this.litStock();
        // les actions du client concernent la prochaine livraison
        params['noLivraison'] = '' + (stock.contexte.noLivraison + 1);
        params['dateCatalogue'] = '' + stock.contexte.dateCatalogue;
        return params;
    }
    protected paramsEditeDétail(): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        return this._paramsAvecContexte(params);
    }
    protected paramsSupprimeDétail(apiDétail: ApiDétailCommande): { [param: string]: string } {
        const params = KeyUidRnoNo2.créeParams(apiDétail);
        return this._paramsAvecContexte(params);
    }

    protected paramsCréeCommande(ikeyClient: IKeyUidRno): { [param: string]: string } {
        const params = KeyUidRno.créeParams(ikeyClient);
        return this._paramsAvecContexte(params);
    }

    // Actions sur la commande

    private _ajouteCatalogueDisponibles(apiResult$: Observable<ApiResult>) {
        return apiResult$.pipe(
            tap((apiResult: ApiResult) => {
                if (apiResult.ok) {
                    this._catalogueService.catalogueDisponibles$().pipe(
                        tap(catalogue => {
                            const stock = this.litStock();
                            stock.catalogue = catalogue;
                            this.fixeStock(stock);
                        })
                    );
                }
                return of(apiResult);
            })
        );
    }

    /**
     * crée une nouvelle commande vide d'un client
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    créeVide(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        return this._créeVide(ikeyClient);
    }
    /** actionSiOk de créeVide */
    siCréeVideOk(ikeyClient: IKeyUidRno) {
        this._siCréeVideOk(ikeyClient);
    }

    /**
     * crée une nouvelle commande d'un client en copiant les détails de la commande précédente
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    créeCopie(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        return this._ajouteCatalogueDisponibles(this._créeCopie(ikeyClient));
    }
    /** actionSiOk de créeCopie */
    siCréeCopieOk(ikeyClient: IKeyUidRno) {
        this._siCréeCopieOk(ikeyClient);
    }

    /**
     * si une soumission a retourné l'erreur EtatChange, efface le stock et redirige vers accueil
     */
    private _actionSiErreur(groupe: KfGroupe) {
        const errors = groupe.formGroup.errors;
        if (errors && Object.keys(errors).find(k => k.toLowerCase() === 'EtatChange'.toLowerCase())) {
            // l'utilisateur est le client
            this._stockage.initialise();
            const site = this.navigation.litSiteEnCours();
            // la route est celle des pages du client
            this.routeur.naviguePageDef(ClientPages.commandes, ClientRoutes, site.nomSite);
        }
    }

}
