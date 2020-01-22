import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { ApiController, ApiAction } from '../commun/api-route';
import { ApiRequêteService } from '../services/api-requete.service';
import { DocumentUtile } from './document-utile';
import { IDataKeyService } from '../commun/data-par-key/i-data-key-service';
import { Observable } from 'rxjs';
import { ApiDocuments, ApiDocumentCommande, ApiDocumentFacture } from './document-api';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ClientService } from '../modeles/client/client.service';
import { switchMap, map } from 'rxjs/operators';
import { Documents } from './documents';
import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { DocumentCommande, DocumentLivraison } from './document-commande';
import { DocumentFacture } from './document-facture';

@Injectable()
export class DocumentService extends DataService implements IDataKeyService {
    controllerUrl = ApiController.document;

    private _utile: DocumentUtile;

    constructor(
        protected _apiRequete: ApiRequêteService,
        protected _clientService: ClientService,
    ) {
        super(_apiRequete);
        this._utile = new DocumentUtile(this);
    }

    get dataService(): DataService { return this; }

    get utile(): DocumentUtile {
        return this._utile;
    }

    documents$(): Observable<Documents> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        let key: IKeyUidRno = identifiant.keyClient(site);
        let action: string;
        if (!key) {
            key = site;
            action = ApiAction.document.listeF;
        } else {
            action = ApiAction.document.client;
        }
        const apiResult$ = this.get<ApiDocuments>(ApiController.document, action, KeyUidRno.créeParams(key));
        return this.objet<ApiDocuments>(apiResult$).pipe(
            switchMap(apiDoc => {
                return this._clientService.clients$().pipe(
                    map(clients => {
                        const docs = new Documents(apiDoc.commandes, apiDoc.factures, clients);
                        return docs;
                    })
                );
            })
        );

    }

    commande$(key: IKeyUidRnoNo): Observable<DocumentCommande> {
        const apiResult$ = this.get<ApiDocumentCommande>(ApiController.document, ApiAction.document.commande, KeyUidRnoNo.créeParams(key));
        return this.objet<ApiDocumentCommande>(apiResult$).pipe(
            switchMap(apiCommande => {
                return this._clientService.client$(key.uid, key.rno).pipe(
                    map(client => {
                        const doc = new DocumentCommande(apiCommande, client);
                        return doc;
                    })
                );
            })
        );
    }

    livraison$(key: IKeyUidRnoNo): Observable<DocumentLivraison> {
        const apiResult$ = this.get<ApiDocumentCommande>(ApiController.document, ApiAction.document.livraison, KeyUidRnoNo.créeParams(key));
        return this.objet<ApiDocumentCommande>(apiResult$).pipe(
            switchMap(apiCommande => {
                return this._clientService.client$(key.uid, key.rno).pipe(
                    map(client => {
                        const doc = new DocumentLivraison(apiCommande, client);
                        return doc;
                    })
                );
            })
        );
    }

    facture$(key: IKeyUidRnoNo): Observable<DocumentFacture> {
        const apiResult$ = this.get<ApiDocumentFacture>(ApiController.document, ApiAction.document.facture, KeyUidRnoNo.créeParams(key));
        return this.objet<ApiDocumentFacture>(apiResult$).pipe(
            switchMap(apiFacture => {
                return this._clientService.client$(key.uid, key.rno).pipe(
                    map(client => {
                        const doc = new DocumentFacture(apiFacture, client);
                        return doc;
                    })
                );
            })
        );
    }
}
