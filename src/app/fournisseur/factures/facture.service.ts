import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { ApiFactures } from './facture-api';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { mergeMap, concatMap } from 'rxjs/operators';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { KeyUidRnoService } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { FactureUtile } from './facture-utile';
import { ApiCommande, ApiDétailCommande } from 'src/app/commandes/api-commande';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { ModeAction } from 'src/app/commandes/condition-action';
import { Site } from 'src/app/modeles/site';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { FactureStock } from './facture-stock';
import { FactureCommande } from './facture-commande';
import { FactureDétail } from './facture-detail';
import { Facture } from './facture';

@Injectable({
    providedIn: 'root'
})
export class FactureService extends KeyUidRnoService<ApiCommande> {

    controllerUrl = 'facture';

    private _stockage: Stockage<FactureStock>;

    private _modeActionIO: KfInitialObservable<ModeAction>;
    private _subscriptionDeModeTableAModeAction: Subscription;

    private _nbDétailsNonFacturésIO: KfInitialObservable<number>;
    private _keyFactureEnCours: IKeyUidRno;

    constructor(
        private _catalogueService: CatalogueService,
        _stockageService: StockageService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this._stockage = _stockageService.nouveau('factures', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
        this._nbDétailsNonFacturésIO = KfInitialObservable.nouveau<number>(NaN);
        this.créeUtile();
    }

    private get transformeSiteFnc(): (site: Site) => ModeAction {
        return (site: Site) => {
            if (!site) {
                return ModeAction.aucun;
            }
            return site.etat === IdEtatSite.catalogue
                ? ModeAction.aperçu
                : ModeAction.edite;
        };
    }

    private get transformeModeFnc(): (modeAction: ModeAction) => ModeTable {
        return (modeAction: ModeAction) => {
            switch (modeAction) {
                case ModeAction.aperçu:
                    return ModeTable.aperçu;
                case ModeAction.aucun:
                    return ModeTable.sans;
                case ModeAction.envoi:
                    return ModeTable.bilan;
                default:
                    return ModeTable.edite;
            }
        };
    }

    private modeTableSouscritAModeAction() {
        this._subscriptionDeModeTableAModeAction = this._modeActionIO.observable.subscribe(modeAction => {
            this._modeTableIO.changeValeur(this.transformeModeFnc(modeAction));
        });
    }

    créeUtile() {
        this._utile = new FactureUtile(this);
        const site = this.navigation.litSiteEnCours();
        this._modeActionIO = KfInitialObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        const siteObs = this.navigation.siteObs();
        siteObs.subscribe(site1 => {
            this._modeActionIO.changeValeur(this.transformeSiteFnc(site1));
        });
        this._modeTableIO = KfInitialObservable.nouveau<ModeTable>(this.transformeModeFnc(this._modeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this._utile.observeModeTable(this._modeTableIO);
        this.utile.observeModeAction(this._modeActionIO);
    }

    initialiseModeAction(modeAction: ModeAction, modeTable?: ModeTable) {
        if (modeAction) {
            if (modeTable) {
                this._subscriptionDeModeTableAModeAction.unsubscribe();
            }
            this.changeMode(modeAction);
            if (modeTable) {
                this.modeTableSouscritAModeAction();
            }
        }
        if (modeTable) {
            this._modeTableIO.changeValeur(modeTable);
        }
    }

    get modeActionIO(): KfInitialObservable<ModeAction> {
        return this._modeActionIO;
    }

    get modeAction(): ModeAction {
        return this._modeActionIO.valeur;
    }

    changeMode(mode: ModeAction) {
        this._modeActionIO.changeValeur(mode);
    }

    get utile(): FactureUtile {
        return this._utile as FactureUtile;
    }

    litStock(): FactureStock {
        const stock = this._stockage.litStock();
        if (stock) {
            const nouveau = new FactureStock(stock.factures, stock.noProchaineFacture);
            nouveau.catalogue = stock.catalogue;
            return nouveau;
        }
    }
    fixeStock(stock: FactureStock) {
        this._stockage.fixeStock(stock);
    }

    get nbDétailsNonFacturésIO(): KfInitialObservable<number> {
        return this._nbDétailsNonFacturésIO;
    }
    changeClient(client: IKeyUidRno) {
        this._keyFactureEnCours = client;
        const stock = this.litStock();
        this._nbDétailsNonFacturésIO.changeValeur(stock.nbDétailsNonFacturés(this._keyFactureEnCours));
    }

    private _litFactures$(keySite: IKeyUidRno): Observable<ApiFactures> {
        const apiResult$ = this.get<ApiFactures>(ApiController.facture, ApiAction.facture.clients, this.créeParams(keySite));
        return this.objet<ApiFactures>(apiResult$);
    }

    private _ajouteCatalogue$(stock: FactureStock): Observable<FactureStock> {
        return this._catalogueService.catalogueDisponibles$().pipe(
            mergeMap((catalogue: Catalogue) => {
                stock.catalogue = catalogue;
                this.fixeStock(stock);
                return of(stock);
            })
        );
    }

    stock$(): Observable<FactureStock> {
        let stock = this.litStock();
        const site = this.navigation.litSiteEnCours();
        const keySite = {
            uid: site.uid,
            rno: site.rno
        };
        if (!stock) {
            return this._litFactures$(keySite).pipe(
                concatMap((factures: ApiFactures) => {
                    stock = new FactureStock(factures.factures, factures.noProchaineFacture);
                    stock.initialiseLivraisons(factures.livraisons);
                    return this._ajouteCatalogue$(stock);
                })
            );
        }

        return of(stock);
    }

    // ACTIONS

    // Détails
    private _factureDétail(détail: FactureDétail, aFacturer: number): Observable<ApiResult> {
        const apiDétailAEnvoyer: ApiDétailCommande = détail.créeApiDetailClé();
        apiDétailAEnvoyer.aFacturer = aFacturer;
        return this.put(ApiController.facture, ApiAction.facture.detail, apiDétailAEnvoyer);
    }
    private _factureDétailOk(détail: FactureDétail, aFacturer: number) {
        const stock = this.litStock();
        const détailStock = stock.apiDétail(détail);
        détailStock.aFacturer = aFacturer;
        this.fixeStock(stock);
        const étaitDéjàFacturé = détail.estFacturé;
        détail.aFacturer = aFacturer;
        this._nbDétailsNonFacturésIO.changeValeur(stock.nbDétailsNonFacturés(this._keyFactureEnCours));
    }

    factureDétail(détail: FactureDétail): Observable<ApiResult> {
        return this._factureDétail(détail, détail.aFacturer);
    }
    factureDétailOk(détail: FactureDétail) {
        this._factureDétailOk(détail, détail.aFacturer);
    }

    copieDétail(détail: FactureDétail): Observable<ApiResult> {
        return this._factureDétail(détail, détail.aLivrer);
    }
    copieDétailOk(détail: FactureDétail) {
        détail.aFacturer = détail.aLivrer;
        this._factureDétailOk(détail, détail.aLivrer);
    }

    annuleDétail(détail: FactureDétail): Observable<ApiResult> {
        return this._factureDétail(détail, 0);
    }
    annuleDétailOk(détail: FactureDétail) {
        détail.aFacturer = 0;
        this._factureDétailOk(détail, 0);
    }

    annuleCommande(commande: FactureCommande): Observable<ApiResult> {
        const params = this.créeParams(commande);
        params['no'] = '' + commande.no;
        return this.post(ApiController.facture, ApiAction.facture.annuleCommande, null, params);
    }
    annuleCommandeOk(commande: FactureCommande) {
        const stock = this.litStock();
        const apiCommande = stock.apiFactureCommande(commande);
        apiCommande.details.forEach(d => d.aFacturer = 0);
        commande.détails.forEach(d => d.aFacturer = 0);
        this.fixeStock(stock);
        this._nbDétailsNonFacturésIO.changeValeur(stock.nbDétailsNonFacturés(this._keyFactureEnCours));
    }

    copieCommande(commande: FactureCommande): Observable<ApiResult> {
        const params = this.créeParams(commande);
        params['no'] = '' + commande.no;
        return this.post(ApiController.facture, ApiAction.facture.copieCommande, null, params);
    }
    copieCommandeOk(commande: FactureCommande) {
        const stock = this.litStock();
        const apiCommande = stock.apiFactureCommande(commande);
        apiCommande.details.forEach(d => d.aFacturer = d.aLivrer);
        commande.détails.forEach(d => d.aFacturer = d.aLivrer);
        this.fixeStock(stock);
        this._nbDétailsNonFacturésIO.changeValeur(stock.nbDétailsNonFacturés(this._keyFactureEnCours));
    }

    copieCommandes(facture: Facture): Observable<ApiResult> {
        return this.post(ApiController.facture, ApiAction.facture.copieCommandes, null, this.créeParams(facture));
    }
    copieCommandesOk(facture: Facture) {
        const stock = this.litStock();
        const apiFacture = stock.apiFacture(facture);
        apiFacture.commandes.forEach(c => c.details.forEach(d => d.aFacturer = d.aLivrer));
        facture.commandes.forEach(c => c.détails.forEach(d => d.aFacturer = d.aLivrer));
        this.fixeStock(stock);
        this._nbDétailsNonFacturésIO.changeValeur(stock.nbDétailsNonFacturés(this._keyFactureEnCours));
    }

    facture(client: IKeyUidRno): Observable<ApiResult> {
        return this.post(ApiController.facture, ApiAction.facture.facture, null, this.créeParams(client));
    }
    factureOk(client: IKeyUidRno) {
        const stock = this.litStock();
        const index = stock.factures.findIndex(f => f.uid === client.uid && f.rno === client.rno);
        stock.factures.splice(index, 1);
        stock.noProchaineFacture++;
        this.fixeStock(stock);
    }

}
