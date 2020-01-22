import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { ApiCommande, ApiDétailCommandeData } from 'src/app/commandes/api-commande';
import { ApiLivraison } from './api-livraison';
import { mergeMap, concatMap, tap, map } from 'rxjs/operators';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Commande } from 'src/app/commandes/commande';
import { SiteService } from 'src/app/modeles/site/site.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { LivraisonProduit } from './livraison-produit';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { CommandeService } from 'src/app/commandes/commande.service';
import { LivraisonStock } from './livraison-stock';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { LivraisonUtile } from './livraison-utile';
import { BilanLivraison } from './livraison-etat';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { Site } from 'src/app/modeles/site/site';
import { ModeAction } from 'src/app/commandes/condition-action';
import { ApiResult200Ok } from 'src/app/commun/api-results/api-result-200-ok';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ClientService } from 'src/app/modeles/client/client.service';
import { Client } from 'src/app/modeles/client/client';
import { ApiResult201Created } from 'src/app/commun/api-results/api-result-201-created';

@Injectable({
    providedIn: 'root'
})
export class LivraisonService extends CommandeService {

    controllerUrl = ApiController.livraison;

    protected _stockage: Stockage<LivraisonStock>;

    private _bilanLivraisonIO: KfInitialObservable<BilanLivraison>;

    constructor(
        private _catalogueService: CatalogueService,
        _stockageService: StockageService,
        private _siteService: SiteService,
        protected _apiRequete: ApiRequêteService,
        private _clientService: ClientService,
    ) {
        super(_apiRequete);
        this._stockage = _stockageService.nouveau<LivraisonStock>('Livraison', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
        this._bilanLivraisonIO = KfInitialObservable.nouveau(BilanLivraison.bilanVide());
        this.créeUtile();
    }

    protected get transformeSiteFnc(): (site: Site) => ModeAction {
        return (site: Site) => {
            if (!site) {
                return ModeAction.aucun;
            }
            return site.etat === IdEtatSite.catalogue
                ? ModeAction.aperçu
                : ModeAction.edite;
        };
    }

    /// implémente ICommandeService
    get service(): CommandeService { return this; }

    protected _créeUtile() {
        this._utile = new LivraisonUtile(this);
    }
    get utile(): LivraisonUtile {
        return this._utile as LivraisonUtile;
    }

    /// SECTION Surcharges de CommandeService

    litStock(): LivraisonStock {
        const stock = this._stockage.litStock();
        if (stock) {
            return new LivraisonStock(stock.apiLivraison, stock.etatSite, stock.catalogue, stock.clients, stock.bilan);
        }
    }
    fixeStock(stock: LivraisonStock) {
        stock.créeBilan();
        this._stockage.fixeStock(stock);
        this._bilanLivraisonIO.changeValeur(stock.bilan);
    }
    commandeStockée(stock: LivraisonStock, ikeyClient: IKeyUidRno): ApiCommande {
        return stock.apiLivraison.commandes.find(c => KeyUidRno.compareKey(ikeyClient, c));
    }
    stockeCommande(stock: LivraisonStock, commande: ApiCommande) {
        stock.apiLivraison.commandes.push(commande);
    }
    déstockeCommande(stock: LivraisonStock, ikeyCommande: IKeyUidRnoNo) {
        const index = stock.apiLivraison.commandes.findIndex(c => KeyUidRno.compareKey(ikeyCommande, c));
        stock.apiLivraison.commandes.splice(index, 1);
    }

    /// FIN SECTION Surcharges de CommandeService

    /// SECTION Suivi de l'état

    get bilanLivraisonIO(): KfInitialObservable<BilanLivraison> {
        return this._bilanLivraisonIO;
    }

    get bilanLivraison(): BilanLivraison {
        const stock = this.litStock();
        return stock.créeBilan();
    }

    /// FIN SECTION Suivi de l'état

    /// SECTION Observables du stock

    private _litApiLivraison$(keySite: IKeyUidRno): Observable<ApiLivraison> {
        const apiResult$ = this.get<ApiLivraison>(ApiController.livraison, ApiAction.livraison.encours, KeyUidRno.créeParams(keySite));
        return this.objet<ApiLivraison>(apiResult$);
    }

    private _ajouteCatalogueEtClients$(stock: LivraisonStock): Observable<LivraisonStock> {
        return this._catalogueService.catalogueDisponibles$().pipe(
            tap((catalogue: Catalogue) => {
                stock.catalogue = catalogue;
            }),
            mergeMap(x => this._clientService.clients$().pipe(
                tap((clients: Client[]) => {
                    stock.clients = clients;
                }))
            ),
            concatMap(x => {
                this.fixeStock(stock);
                return of(stock);
            }));
    }

    stock$(): Observable<LivraisonStock> {
        let stock = this.litStock();
        const site = this.navigation.litSiteEnCours();
        const keySite = {
            uid: site.uid,
            rno: site.rno
        };
        if (!stock
            || !KeyUidRno.compareKey(stock.keySite, keySite) // site changé
        ) {
            return this._litApiLivraison$(keySite).pipe(
                concatMap((apiLivraison: ApiLivraison) => {
                    stock = new LivraisonStock(apiLivraison, site.etat);
                    return this._ajouteCatalogueEtClients$(stock);
                })
            );
        }

        if (stock.etatSite !== site.etat) {
            return this._ajouteCatalogueEtClients$(stock);
        }

        return of(stock);
    }

    /**
     * Recharge les dernières commandes ouvertes des clients avec compte
     * Retourne un Observable du stock mis à jour
     */
    rafraichitStock(site: Site): Observable<LivraisonStock> {
        const stock = this.litStock();

        const apiResult$ = this.get<ApiLivraison>(ApiController.livraison, ApiAction.livraison.avecCompte, KeyUidRno.créeParams(site));
        return this.objet<ApiLivraison>(apiResult$).pipe(
            concatMap((apiLivraison: ApiLivraison) => {
                if (apiLivraison.commandes.length === 0) {
                    stock.apiLivraison.date = apiLivraison.date;
                    this.fixeStock(stock);
                    return of(stock);
                }
                stock.rafraichit(apiLivraison.commandes, apiLivraison.date);
                return this._clientService.rafraichitStock().pipe(
                    tap((clients: Client[]) => {
                        stock.clients = clients;
                    }),
                    concatMap(x => {
                        this.fixeStock(stock);
                        return of(stock);
                    }));
            })
        );
    }

    /// FIN SECTION Observables du stock

    // STOCK

    // Actions sur les détails

    détailStocké(stock: LivraisonStock, ikeyDétail: DetailCommande): ApiDétailCommandeData {
        const commande = this.commandeStockée(stock, ikeyDétail.client);
        if (commande) {
            return commande.details.find(d => d.no === ikeyDétail.produit.no);
        }
    }

    // Action sur la commande

    /**
     * copie la demande d'un détail d'une commande dans son aLivrer
     * @param détail
     */
    copieDemande(détail: DetailCommande): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.copieDemandeDétail, null,
            KeyUidRnoNo2.créeParams(détail.créeApiDetailClé()));
    }
    /** actionSiOk de copieDemande */
    siCopieDemandeOk(détail: DetailCommande) {
        const stock = this.litStock();
        const détailStock = this.détailStocké(stock, détail);
        détailStock.aLivrer = détailStock.demande;
        détail.aLivrer = détail.demande;
        this.fixeStock(stock);
    }

    /**
     * copie les demandes des détails d'une commande d'état APréparer dans les aLivrer correspondants
     * @param commande
     */
    copieDemandesCommande(commande: Commande): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.copieDemandesCommande, null, KeyUidRno.créeParams(commande));
    }
    /** actionSiOk de copieDemandesCommande */
    siCopieDemandesCommandeOk(commande: Commande) {
        const stock = this.litStock();
        const comstock = this.commandeStockée(stock, commande);
        comstock.details.forEach(d => d.aLivrer = d.demande);
        this.fixeStock(stock);
    }

    /**
     * copie les demandes des détails demandant le produit dans les aLivrer correspondants
     * @param produit
     */
    copieDemandesProduit(produit: LivraisonProduit): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.copieDemandesProduit, null, KeyUidRnoNo.créeParams(produit));
    }
    /** actionSiOk de copieDemandesProduit */
    siCopieDemandesProduitOk(produit: LivraisonProduit) {
        const stock = this.litStock();
        produit.détails.forEach(détail => {
            const détailStock = this.détailStocké(stock, détail);
            détailStock.aLivrer = détailStock.demande;
        });
        this.fixeStock(stock);
    }

    /**
     * copie les demandes des détails demandant le produit dans les aLivrer correspondants
     * @param produit
     */
    copieDemandes(): Observable<ApiResult> {
        const site = this.navigation.litSiteEnCours();
        return this.post(ApiController.commande, ApiAction.commande.copieDemandes, null, KeyUidRno.créeParams(site));
    }
    /** actionSiOk de copieDemandes */
    siCopieDemandesOk() {
        const stock = this.litStock();
        stock.apiCommandesATraiter.forEach(c => c.details.forEach(détail => {
            détail.aLivrer = détail.demande;
        }));
        this.fixeStock(stock);
    }

    // Actions sur la commande

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
        return this._créeCopie(ikeyClient);
    }
    /** actionSiOk de créeCopie */
    siCréeCopieOk(ikeyClient: IKeyUidRno) {
        this._siCréeCopieOk(ikeyClient);
    }

    // Actions sur la livraison

    // ACTIONS
    commenceLivraison(site: Site): Observable<ApiResult> {
        const stock = this.litStock();

        return this.post(ApiController.livraison, ApiAction.livraison.commence, null, KeyUidRno.créeParams(site)).pipe(
            concatMap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    const apiLivraison: ApiLivraison = (apiResult as ApiResult201Created).entity as ApiLivraison;
                    if (apiLivraison.commandes.length === 0) {
                        stock.apiLivraison.date = apiLivraison.date;
                        this.fixeStock(stock);
                        return of(apiResult);
                    }
                    stock.rafraichit(apiLivraison.commandes, apiLivraison.date);
                    return this._clientService.rafraichitStock().pipe(
                        map(clients => {
                            stock.clients = clients;
                            this.fixeStock(stock);
                            return apiResult;
                        })
                    );
                }
                return of(apiResult);
            })
        );
    }
    /**
     * fixe le numéro de livraison des commandes sans numéro de livraison
     * @param site
     */
    commenceLivraisonOk(site: Site) {
        const stock = this.litStock();
//        stock.etatSite = IdEtatSite.livraison;
        stock.apiCommandesATraiter.forEach(c => c.livraisonNo = stock.livraisonNo);
        this.fixeStock(stock);
//        this._siteService.changeEtatOk(site, IdEtatSite.livraison);
    }

    annuleLivraison(site: Site): Observable<ApiResult> {
        return this.post(ApiController.livraison, ApiAction.livraison.annule, null, KeyUidRno.créeParams(site));
    }
    annuleLivraisonOk(site: Site) {
        const stock = this.litStock();
        stock.etatSite = IdEtatSite.ouvert;
        stock.apiCommandesATraiter.forEach(c => c.livraisonNo = undefined);
        this.fixeStock(stock);
        this._siteService.changeEtatOk(site, IdEtatSite.ouvert);
    }

    /**
     * termine la livraison et recharge le stock
     * @param site
     */
    termineLivraison(site: Site): Observable<ApiResult> {
        return this.post(ApiController.livraison, ApiAction.livraison.termine, null, KeyUidRno.créeParams(site)).pipe(
            mergeMap((apiResult: ApiResult) => {
                if (apiResult.ok) {
                    return this.get<ApiLivraison>(ApiController.livraison, ApiAction.livraison.encours, this.créeParams(site)).pipe(
                        tap(result => {
                            if (result.statusCode === ApiResult200Ok.code) {
                                const apiLivraison: ApiLivraison = (result as ApiResult200Ok<ApiLivraison>).lecture;
                                const stock = this.litStock();
                                stock.apiLivraison = apiLivraison;
                                this.fixeStock(stock);
                            }
                        })
                    );
                }
                return of(apiResult);
            })
        );
    }
    termineLivraisonOk(site: Site) {
//        this._siteService.changeEtatOk(site, IdEtatSite.livraison);
    }

    /**
     * fixe la date de la livraison
     * change l'état du site en Ouvert
     * param: key du site
     */
    envoieBon(): Observable<ApiResult> {
        const keySite = this.keySiteEnCours;
        return this.post(ApiController.livraison, ApiAction.livraison.termine, null, KeyUidRno.créeParams(keySite));
    }
    /** actionSiOk de envoieBon */
    siEnvoieBonOk() {
        this._siteService.changeEtatOk(this.navigation.litSiteEnCours(), IdEtatSite.ouvert);
        const stock = this.litStock();
        stock.etatSite = IdEtatSite.ouvert;
        stock.apiLivraison.commandes = stock.apiLivraison.commandes.filter(c => c.details.length > 0);
        stock.apiLivraison.commandes.forEach(c => {
            c.date = undefined;
        });
        this.fixeStock(stock);
    }

}
