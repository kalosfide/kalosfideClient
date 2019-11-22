import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { compareKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { mergeMap, switchMap, concatMap, tap } from 'rxjs/operators';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ApiContexteCommande, CommanderStock } from './commander';
import { CommandeRoutes } from './commander-pages';
import { ApiCommande, ApiDétailCommande } from 'src/app/commandes/api-commande';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { CommandeService } from 'src/app/commandes/commande.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { CommanderUtile } from './commander-utile';
import { Site } from 'src/app/modeles/site';
import { ModeAction } from 'src/app/commandes/condition-action';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { ClientPages, ClientRoutes } from '../client-pages';
import { KeyUidRnoNo2CréeParams } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';

@Injectable({
    providedIn: 'root'
})
export class CommanderService extends CommandeService {

    controllerUrl = 'commande';

    protected _stockage: Stockage<CommanderStock>;
    actionSiErreur: (groupe: KfGroupe) => void = this._actionSiErreur;

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
        this.redirigeSiErreur400 = () => [{ code: 'etatChange', traite: (() => this.redirigeVersListe()).bind(this) }];
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
        if (!ikeyClient || compareKeyUidRno(stock.keyIdentifiant, ikeyClient)) {
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

    private _litApiContexte$(keyClient: KeyUidRno): Observable<ApiContexteCommande> {
        const apiResult$ = this.get<ApiContexteCommande>(ApiController.commande, ApiAction.commande.contexte, this.créeParams(keyClient));
        return this.objet<ApiContexteCommande>(apiResult$);
    }

    public apiContexte$(): Observable<ApiContexteCommande> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyClient = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };
        const apiResult$ = this.get<ApiContexteCommande>(ApiController.commande, ApiAction.commande.contexte, this.créeParams(keyClient));
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
                    || !compareKeyUidRno(stock.keySite, site) // site changé
                    || !compareKeyUidRno(stock.keyIdentifiant, keyClient) // identifiant changé
                    || stock.contexte.livraisonNo !== contexte.livraisonNo // numéro de livraison changé
                    || stock.contexte.etatSite !== contexte.etatSite // état du site changé
                    || stock.contexte.dateCatalogue !== contexte.dateCatalogue; // date du catalogue changé
            }
            if (changé) {
                this._stockage.initialise();
            }
            return changé;
        }
    }

    private _litApiCommande$(keyClient: KeyUidRno): Observable<ApiCommande> {
        const apiResult$ = this.get<ApiCommande>(ApiController.commande, ApiAction.commande.encours, this.créeParams(keyClient));
        return this.objet<ApiCommande>(apiResult$);
    }

    private _vérifieStock$(contexte: ApiContexteCommande, site: Site, keyIdentifiant: KeyUidRno): Observable<{
        stock: CommanderStock,
        changé: boolean
    }> {
        const stock = this.litStock();
        let nouveau: CommanderStock;
        const changé = !stock
            || !compareKeyUidRno(stock.keySite, site) // site changé
            || !compareKeyUidRno(stock.keyIdentifiant, keyIdentifiant) // identifiant changé
            || stock.contexte.livraisonNo !== contexte.livraisonNo // numéro de livraison changé
            || stock.contexte.etatSite !== contexte.etatSite // état du site changé
            || stock.contexte.dateCatalogue !== contexte.dateCatalogue; // date du catalogue changé

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
                        let catalogue$: Observable<Catalogue>;
                        if (ApiCommande.terminée(apiCommande)) {
                            catalogue$ = this._catalogueService.tarifCommande$(apiCommande);
                        } else {
                            catalogue$ = this._catalogueService.catalogueDisponibles$();
                        }
                        return catalogue$.pipe(
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

    _stock$(): Observable<CommanderStock> {
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

    /**
     * appelé par les resolvers de accueil et bon
     */
    stock$(): Observable<CommanderStock> {
        return this._stock$();
    }

    /// FIN SECTION Observables du stock

    // API

    private _paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        const stock = this.litStock();
        // les actions du client concernent la prochaine livraison
        params['livraisonNo'] = '' + (stock.contexte.livraisonNo + 1);
        params['dateCatalogue'] = '' + stock.contexte.dateCatalogue;
        return params;
    }
    protected paramsEditeDétail(): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        return this._paramsAvecContexte(params);
    }
    protected paramsSupprimeDétail(apiDétail: ApiDétailCommande): { [param: string]: string } {
        const params = KeyUidRnoNo2CréeParams(apiDétail);
        return this._paramsAvecContexte(params);
    }

    protected paramsCréeCommande(ikeyClient: IKeyUidRno): { [param: string]: string } {
        const params = this.créeParams(ikeyClient);
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

    private redirigeVersListe() {
        this._stockage.initialise();
        const site = this.navigation.litSiteEnCours();
        this.routeur.naviguePageDef(CommandePages.liste, CommandeRoutes, site.nomSite);
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
        this.redirigeVersListe();
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
        this.redirigeVersListe();
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
