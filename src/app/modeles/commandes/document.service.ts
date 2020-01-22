import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Subscription, Observable, of } from 'rxjs';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { Site } from '../site/site';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { ModeAction } from './condition-action';
import { ApiDocument } from './api-document';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { Documents } from './documents';
import { map, tap, mergeMap, concatMap } from 'rxjs/operators';
import { ApiDocumentsData } from './api-documents-client-data';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Catalogue } from '../catalogue/catalogue';
import { ClientService } from '../client/client.service';
import { TypeDocument } from './document';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

export abstract class DocumentService extends KeyUidRnoNoService<ApiDocument> {

    private _modeActionIO: KfInitialObservable<ModeAction>;
    private _subscriptionDeModeTableAModeAction: Subscription;

    protected _stockage: Stockage<Documents>;

    constructor(
        private _catalogueService: CatalogueService,
        _stockageService: StockageService,
        private _clientService: ClientService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this._stockage = _stockageService.nouveau<Documents>('Commander', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
    }

    protected abstract get transformeSiteFnc(): (site: Site) => ModeAction;

    protected get transformeModeFnc(): (modeAction: ModeAction) => ModeTable {
        return (modeAction: ModeAction) => {
            switch (modeAction) {
                case ModeAction.aperçu:
                    return ModeTable.aperçu;
                case ModeAction.aucun:
                    return ModeTable.sans;
                case ModeAction.envoi:
                    return ModeTable.bilan;
                case ModeAction.doitCréer:
                    return ModeTable.aperçu;
                case ModeAction.supprime:
                    return ModeTable.aperçu;
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
        const site = this.navigation.litSiteEnCours();
        this._modeActionIO = KfInitialObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        this._modeTableIO = KfInitialObservable.nouveau<ModeTable>(this.transformeModeFnc(this._modeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this._créeUtile();
        this._utile.observeModeTable(this._modeTableIO);
        // IMPORTANT à faire après la création des condi
        const siteObs = this.navigation.siteObs();
        siteObs.subscribe(site1 => {
            this._modeActionIO.changeValeur(this.transformeSiteFnc(site1));
        });
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

    // STOCK

    protected abstract _créeStock(): Documents;
    protected abstract _créeDocument(): Document;

    litStock(): Documents {
        const stock = this._créeStock();
        stock.copie(this._stockage.litStock());
        return stock;
    }

    fixeStock(stock: Documents) {
        //        stock.créeBilan();
        this._stockage.fixeStock(stock);
        //        this._bilanIO.changeValeur(stock.bilan);
    }

    // Lectures de Documents

    private documents$(controller: string, action: string,
        params: { [param: string]: string },
        avecCatalogue: 'avecCatalogue' | 'sansCatalogue',
        keyClient: IKeyUidRno | 'sansClient',
        avecClients: 'avecClients' | 'sansClients'
    ): Observable<Documents> {
        const apiResult$ = this.get<ApiDocumentsData>(controller, action, params);
        let documents$: Observable<Documents> = this.objet<ApiDocumentsData>(apiResult$).pipe(
            map(datas => {
                const stock = new Documents();
                stock.charge(datas);
                return stock;
            })
        );
        if (avecCatalogue === 'avecCatalogue') {
            documents$ = documents$.pipe(
                concatMap(documents => {
                    return this._catalogueService.catalogueDisponibles$().pipe(
                        mergeMap(catalogue => {
                            const tarifs = documents.apiDocuments.map(d => d.tarif);
                            Catalogue.ajoutePrixDatés(catalogue, tarifs);
                            documents.catalogue = catalogue;
                            return of(documents);
                        })
                    );
                })
            );
        }
        if (typeof (keyClient) !== 'string') {
            documents$ = documents$.pipe(
                concatMap(documents => {
                    return this._clientService.client$(keyClient.uid, keyClient.rno).pipe(
                        mergeMap(client => {
                            documents.client = client;
                            return of(documents);
                        })
                    );
                })
            );
        }
        if (avecClients === 'avecClients') {
            documents$ = documents$.pipe(
                concatMap(documents => {
                    return this._clientService.clients$().pipe(
                        mergeMap(clients => {
                            documents.clients = clients;
                            return of(documents);
                        })
                    );
                })
            );
        }
        return documents$;
    }

    private stock$(controller: TypeDocument, action: string,
        params: { [param: string]: string },
        keyClient: IKeyUidRno | 'sansClient',
    ): Observable<Documents> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };
        
        const apiResult$ = this.get<ApiDocumentsData>(controller, action, params);
        let documents$: Observable<Documents> = this.objet<ApiDocumentsData>(apiResult$).pipe(
            concatMap(datas => {
                const documents = new Documents();
                documents.charge(datas);
                documents.initialise(controller, keyIdentifiant, site);
                return this._catalogueService.catalogueDisponibles$().pipe(
                    mergeMap(catalogue => {
                        const tarifs = documents.apiDocuments.map(d => d.tarif);
                        Catalogue.ajoutePrixDatés(catalogue, tarifs);
                        documents.catalogue = catalogue;
                        return of(documents);
                    })
                );
            })
        );
        if (typeof (keyClient) !== 'string') {
            documents$ = documents$.pipe(
                concatMap(documents => {
                    return this._clientService.client$(keyClient.uid, keyClient.rno).pipe(
                        mergeMap(client => {
                            documents.client = client;
                            return of(documents);
                        })
                    );
                })
            );
        }
        return documents$;
    }

    /**
     * Pour le client.
     * Le Documents lu dans l'Api contient les listes des résumés des Commande, Livraison, Facture du client.
     * Le Documents retourné contient le Client du client.
     * Pas stocké.
     * @param keyClient key du client
     */
    documentsDuClient(keyClient: IKeyUidRno): Observable<Documents> {
        const controller = ApiController.document;
        const action = ApiAction.document.client;
        const params: { [param: string]: string } = {
            'uid': keyClient.uid,
            'rno': '' + keyClient.rno,
            'site': '' + false
        };
        return this.documents$(controller, action, params, 'sansCatalogue', keyClient, 'sansClients');
    }

    /**
     * Pour le fournisseur.
     * Le Documents lu dans l'Api contient les listes des résumés des Commande, Livraison, Facture de tous les clients.
     * Le Documents retourné contient les Client de tous les clients.
     * Pas stocké.
     * @param keySite key du site
     */
    documentsDuSite(keySite: IKeyUidRno) {
        const params: { [param: string]: string } = {
            'uid': keySite.uid,
            'rno': '' + keySite.rno,
            'site': '' + true
        };
    }

    /**
     * Pour le client et le fournisseur.
     * Le Documents lu dans l'Api contient la commande avec les lignes.
     * Le Documents retourné contient le catalogue à appliquer.
     * Le Documents retourné contient le Client du client.
     * Stocké.
     * @param keyDocument key du document
     * @param type type du document
     */
    document(keyDocument: IKeyUidRnoNo, type: TypeDocument) {
        const params: { [param: string]: string } = {
            'uid': keyDocument.uid,
            'rno': '' + keyDocument.rno,
            'no': '' + keyDocument.no,
            'type': type
        };
    }

    /**
     * Pour le client.
     * Le Documents lu dans l'Api contient la dernière commande du client avec les lignes.
     * Le Documents retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     */
    commande(keyClient: IKeyUidRno) { }

    /**
     * Pour le fournisseur.
     * Le Documents lu dans l'Api contient les listes des résumés des Commande envoyées et sans livraison de tous les clients.
     * Le Documents retourné contient les Client de tous les clients.
     * Pas stocké.
     * @param keySite key du site
     */
    livraison(keySite: IKeyUidRno) { }

    /**
     * Pour le fournisseur.
     * Le Documents lu dans l'Api contient les Commande envoyées et sans livraison du client avec les lignes.
     * Le Documents retourné contient le Client du client.
     * Le Documents retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     */
    livraisonClient(keyClient: IKeyUidRno) { }

    /**
     * Pour le fournisseur.
     * Le Documents lu dans l'Api contient les listes des résumés des Livraison envoyées et sans facture de tous les clients.
     * Le Documents retourné contient les Client de tous les clients.
     * Pas stocké.
     * @param keySite key du site
     */
    facture(keySite: IKeyUidRno) { }

    /**
     * Pour le fournisseur.
     * Le Documents lu dans l'Api contient les Livraison envoyées et sans facture du client avec les lignes.
     * Le Documents retourné contient le Client du client.
     * Le Documents retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     */
    factureClient(keyClient: IKeyUidRno) { }

    // Actions sur le Documents stocké

    /**
     * Le Documents stocké est de type 'commande' ou 'livraison' et contient un unique document qui a été envoyé.
     */
    Vide() {
        const stock = this.litStock();
        const params: { [param: string]: string } = KeyUidRno.créeParams(stock.client);
        const data = null;
    }

    SiOkVide() { }

    /**
     * Le Documents stocké est de type 'commande' ou 'livraison' et contient un unique document qui a été envoyé.
     */
    Copie() { }

    Envoi() { }

}
