import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CategorieUtile } from './categorie-utile';
import { Categorie } from './categorie';

export class CategorieUtileColonne extends DataUtileColonne {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._parent as CategorieUtile;
    }

    nom(): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'nom',
            enTeteDef: { titreDef: 'Nom' },
            créeContenu: (catégorie: Categorie) => catégorie.nom
        };
    }

    produits(): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'produit',
            enTeteDef: { titreDef: 'Produits' },
            créeContenu: (catégorie: Categorie) => catégorie.nbProduits.toString()
        };
    }

    supprime(): IKfVueTableColonneDef<Categorie> {
        const def: IKfVueTableColonneDef<Categorie> = {
            nom: 'supprime',
            créeContenu: (catégorie: Categorie) => {
                const lien = this.utile.lien.supprime(catégorie);
                lien.inactivité = catégorie.nbProduits > 0;
                return lien;
            },
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
    }

    colonnes(): IKfVueTableColonneDef<Categorie>[] {
        return [
            this.nom(),
            this.produits(),
            this.supprime(),
        ];
    }

}
