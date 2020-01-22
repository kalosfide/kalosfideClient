import { DocumentService } from './document.service';
import { DocumentUtile } from './document-utile';
import { ISiteRoutes } from '../site/site-pages';
import { PageDef } from '../commun/page-def';
import { DocumentRoutes, DocumentPages } from './document-pages';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';
import { DataUtileUrl } from '../commun/data-par-key/data-utile-url';
import { ClientDocumentRoutes } from '../client/documents/c-document-pages';
import { Client } from '../modeles/client/client';
import { FournisseurDocumentRoutes, FDocumentPages } from '../fournisseur/documents/f-document-pages';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DocumentLivraison, DocumentCommande } from './document-commande';
import { IDocument } from './document';
import { DocumentFacture } from './document-facture';

export class DocumentUtileUrl extends DataUtileUrl {

    /** ISiteRoutes de la page titre contenant l'outlet des documents du client */
    private _routeDocuments: ISiteRoutes;
    private _texteKey: (document: IDocument) => string;

    constructor(utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this._parent as DocumentUtile;
    }

    get service(): DocumentService {
        return this.utile.service;
    }

    initialiseRouteDocument(client?: Client) {
        if (!client) {
            // l'utilisateur est le client
            this._texteKey = (document: IDocument) => '' + document.no;
            this._routeDocuments = ClientDocumentRoutes;
        } else {
            this._texteKey = (document: IDocument) => document.key ? document.key : '' + document.no;
            this._routeDocuments = FournisseurDocumentRoutes;
        }
    }

    liste(): IUrlDef {
        return this.__urlDef(this._routeDocuments, DocumentPages.liste);
    }

    document(document: IDocument): IUrlDef {
        return this.__urlDef(this._routeDocuments, DocumentPages.commande, this._texteKey(document));
    }

    retourDeDocument(document: IDocument): IUrlDef {
        const urlDef = this.liste();
        urlDef.fragment = this.id(this._texteKey(document));
        return urlDef;
    }
}

