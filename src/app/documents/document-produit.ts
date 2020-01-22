import { Produit, IAvecProduit } from '../modeles/catalogue/produit';
import { ApiBilanProduit } from './document-api';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { ICoût } from '../commandes/detail-commande-cout';
import { IDocumentLigne } from './document';

export class DocumentProduit implements IAvecProduit, IDocumentLigne {
    private _produit: Produit;
    private _quantité: number;
    private _prix: number;

    constructor(apiBilanProduit: ApiBilanProduit, produits: Produit[]) {
        this._quantité = apiBilanProduit.quantité;
        this._produit = produits.find(p => p.no === apiBilanProduit.no);
        this._prix = apiBilanProduit.prix;
    }

    get produit(): Produit {
        return this._produit;
    }

    get quantité(): number {
        return this._quantité;
    }

    get prix(): string {
        return Fabrique.texte.prix(this._prix);
    }

    get coût(): ICoût {
        return { valeur: this._prix * this._quantité, complet: true };
    }

    get montant(): string {
        return Fabrique.texte.prix(this._prix * this._quantité);
    }
}
