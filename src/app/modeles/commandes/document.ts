import { ApiDocument } from './api-document';
import { Documents } from './documents';
import { Client } from '../client/client';
import { Catalogue } from '../catalogue/catalogue';
import { LigneDocument } from './ligne-base';
import { Produit } from '../catalogue/produit';
import { ApiLigneData, ApiLigne } from './api-ligne-data';
import { DATE_NULLE } from '../date-nulle';

export type TypeDocument = 'commande' | 'livraison' | 'facture';

export class DocCLF {

    type: TypeDocument;
    documents: Documents;
    apiDoc: ApiDocument;
    synthèse: DocCLF;
    àSynthétiser: DocCLF[];

    private _chargeLigne: (ligne: LigneDocument, data: ApiLigneData) => void;

    protected _lignes: LigneDocument[];

    constructor(documents: Documents, type: TypeDocument) {
        this.documents = documents;
        this.type = type;
    }

    get apiLignesData(): ApiLigneData[] {
        return this.apiDoc.lignes;
    }

    get uid(): string { return this.apiDoc.uid; }
    get rno(): number { return this.apiDoc.rno; }
    get no(): number { return this.apiDoc.no; }
    get date(): Date { return new Date(this.apiDoc.date); }

    get catalogue(): Catalogue { return this.documents.catalogue; }

    /**
     * Propriétaire du document, présent si l'utilisateur est le fournisseur
     */
    get client(): Client { return this.documents.client; }

    /**
     * vrai si le document est une commande qui a été envoyée par le client
     */
    get crééParLeClient(): boolean {
        return this.type === 'commande' && this.date !== undefined && this.date !== DATE_NULLE;
    }

    get chargeLigne(): (ligne: LigneDocument, data: ApiLigneData) => void {
        if (!this._chargeLigne) {
            switch (this.type) {
                case 'commande':
                    this._chargeLigne = this.synthèse
                        ? (ligne: LigneDocument, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            if (data) {
                                ligne.apiData.typeCommande = data.typeCommande;
                                ligne.apiData.demande = data.demande;
                                ligne.apiData.aLivrer = data.aLivrer;
                                ligne.ajout = false;
                            } else {
                                ligne.ajout = true;
                            }
                        }
                        : (ligne: LigneDocument, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            if (data) {
                                ligne.apiData.typeCommande = data.typeCommande;
                                ligne.apiData.demande = data.demande;
                                ligne.ajout = false;
                            } else {
                                ligne.ajout = true;
                            }
                        };
                    break;
                case 'livraison':
                    this._chargeLigne = this.synthèse
                        ? (ligne: LigneDocument, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            ligne.apiData.aLivrer = data.aLivrer;
                            ligne.apiData.aFacturer = data.aFacturer;
                        }
                        : (ligne: LigneDocument, data: ApiLigneData) => {
                            ligne.apiData = new ApiLigneData();
                            ligne.apiData.no = ligne.produit.no;
                            ligne.apiData.aLivrer = data.aLivrer;
                        };
                    break;
                case 'facture':
                    this._chargeLigne = (ligne: LigneDocument, data: ApiLigneData) => {
                        ligne.apiData = new ApiLigneData();
                        ligne.apiData.no = ligne.produit.no;
                        ligne.apiData.aFacturer = data.aFacturer;
                    };
            }
        }
        return this._chargeLigne;
    }

    get lignes(): LigneDocument[] {
        return this._lignes;
    }

    créeLigne(no: number): LigneDocument {
        const produit = this.catalogue.produits.find(p => p.no === no);
        const ligne = new LigneDocument(this, produit);
        const apiData = this.apiDoc.lignes.find(d => d.no === no);
        this.chargeLigne(ligne, apiData);
        return ligne;
    }

    créeLignes() {
        this._lignes = this.apiDoc.lignes.map(d => {
            const produit = this.catalogue.produits.find(p => p.no === d.no);
            const ligne = new LigneDocument(this, produit);
            this.chargeLigne(ligne, d);
            return ligne;
        });
    }

    créeSynthèse() {
        let agrégeQuantité: (agrégé: LigneDocument, ligne: LigneDocument) => void;
        switch (this.type) {
            case 'commande':
                break;
            case 'livraison':
                agrégeQuantité = (agrégé: LigneDocument, ligne: LigneDocument) => agrégé.apiData.aLivrer += ligne.apiData.aLivrer;
                break;
            case 'facture':
                agrégeQuantité = (agrégé: LigneDocument, ligne: LigneDocument) => agrégé.apiData.aFacturer += ligne.apiData.aFacturer;
                break;
        }
        const lignes: LigneDocument[] = [];
        this.àSynthétiser.forEach(d => {
            d._lignes.forEach(l => {
                let ligne = lignes.find(l1 => l1.no2 === l.no2 && l1.prix === l.prix);
                if (ligne) {
                    agrégeQuantité(ligne, l);
                } else {
                    ligne = new LigneDocument(this, l.produit);
                    this.chargeLigne(ligne, l);
                    lignes.push(ligne);
                }
            });
        });
        this.apiDoc.lignes = lignes.map(l => l.apiData);
    }
}
