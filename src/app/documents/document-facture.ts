import { DocumentProduit } from './document-produit';
import { Client } from '../modeles/client/client';
import { Facture } from '../fournisseur/factures/facture';
import { ApiDocumentFacture } from './document-api';
import { IDocument } from './document';
import { Catalogue } from '../modeles/catalogue/catalogue';

export class DocumentFacture extends Facture implements IDocument {
    private _produits: DocumentProduit[];
    private _client: Client;

    constructor(apiFacture: ApiDocumentFacture, client: Client) {
        super(apiFacture, client);
        const tarif = Catalogue.nouveau(apiFacture.catalogue);
        this._produits = apiFacture.produits.map(dp => {
            return new DocumentProduit(dp, tarif.produits);
        });
}

    get client(): Client {
        return this._client;
    }

    get apiFacture(): ApiDocumentFacture {
        return this._apiFacture as ApiDocumentFacture;
    }

    get no(): number {
        return this._apiFacture.factureNo;
    }

    get date(): Date {
        return new Date(this.apiFacture.date);
    }
    get code(): string {
        return 'Facture ' + this.factureNo;
    }
    get nbLignes(): number {
        return this.apiFacture.lignes;
    }
    get total(): number {
        return this.apiFacture.total;
    }

    get titre(): string {
        return 'Facture ' + this.no;
    }

    get àOuDe(): string {
        return 'A ';
    }

    get texteVide(): string {
        return 'Il n\'a pas de facture.';
    }

    get lignes(): DocumentProduit[] {
        return this._produits;
    }
}
