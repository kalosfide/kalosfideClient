import { LivraisonProduit } from './livraison-produit';
import { Client } from 'src/app/modeles/client/client';
import { LivraisonCommandes } from './livraison-commandes';
import { LivraisonStock } from './livraison-stock';
import { IDemandeCopiable } from 'src/app/commandes/i-demande-copiable';

export class LivraisonProduits extends LivraisonCommandes implements IDemandeCopiable {

//    private _stock: LivraisonStock;
//    get stock(): LivraisonStock { return this._stock; }

    produits: LivraisonProduit[];

    constructor(stock: LivraisonStock) {
        super(stock);
        const nosProduits: number[] = [];
        stock.apiCommandesATraiter.forEach(c => {
            c.details.forEach(d => {
                if (nosProduits.find(no => no === d.no) === undefined) {
                    nosProduits.push(d.no);
                }
            });
        });
        const produits = nosProduits.map(no => stock.catalogue.produits.find(p => p.no === no));
        this.produits = produits.map(p => new LivraisonProduit(stock, p));
    }

    get produitsParEtat(): {
        aPreparer: LivraisonProduit[],
        pret: LivraisonProduit[],
    } {
        const produitsParEtat = {
            aPreparer: [],
            pret: []
        };
        this.produits.forEach(p => {
            if (p.préparé) {
                produitsParEtat.pret.push(p);
            } else {
                produitsParEtat.aPreparer.push(p);
            }
        });
        return produitsParEtat;
    }

    get àCopier(): LivraisonProduit[] {
        return this.produits.filter(p => p.àCopier.length > 0);
    }
    get préparé(): boolean {
        return this.produits.findIndex(p => !p.préparé) === -1;
    }
    copieDemande() {
        this.produits.forEach(p => p.copieDemande());
    }
}
