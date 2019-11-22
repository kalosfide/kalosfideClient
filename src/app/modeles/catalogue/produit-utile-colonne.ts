import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/trieur';
import { Produit, CompareProduits } from './produit';
import { ProduitUtile } from './produit-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from './etat-produit';

export class ProduitUtileColonne extends DataUtileColonne {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }


    catégorie(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'catégorie',
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('catégorie', CompareProduits.nomCategorie),
            créeContenu: (produit: Produit) => produit.nomCategorie
        };
        return def;
    }

    produit(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'produit',
            enTeteDef: { titreDef: 'Nom' },
            tri: new Tri('produit', CompareProduits.nom),
            créeContenu: (produit: Produit) => produit.nom
        };
        return def;
    }

    typeCommande(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeCommande',
            enTeteDef: { titreDef: 'Se commande' },
            créeContenu: (produit: Produit) => Fabrique.texte.seCommande(produit)
        };
        return def;
    }

    typeMesure(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'typeMesure',
            enTeteDef: { titreDef: 'Se facture' },
            créeContenu: (produit: Produit) => Fabrique.texte.seMesure(produit)
        };
        return def;
    }

    prix(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            enTeteDef: { titreDef: 'Prix en €' },
            créeContenu: (produit: Produit) => Fabrique.texte.prix(produit.prix)
        };
        return def;
    }

    etat(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'état',
            enTeteDef: { titreDef: 'Etat' },
            créeContenu: (produit: Produit) => EtatsProduits.etat(produit.etat).texte
        };
        return def;
    }

    edite(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'edite',
            créeContenu: (produit: Produit) => this.utile.lien.edite(produit),
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
    }

    editePrix(): IKfVueTableColonneDef<Produit> {
        const def: IKfVueTableColonneDef<Produit> = {
            nom: 'prix',
            créeContenu: (produit: Produit) => this.utile.lien.prix(produit),
            nePasAfficherSi: this.utile.conditionSite.pas_catalogue
        };
        return def;
    }

    colonnes(): IKfVueTableColonneDef<Produit>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.typeCommande(),
            this.typeMesure(),
            this.prix(),
        ];
    }

    colonnesFournisseur(): IKfVueTableColonneDef<Produit>[] {
        return this.colonnes().concat([
            this.etat(),
            this.edite(),
            this.editePrix(),
        ]);
    }

}
