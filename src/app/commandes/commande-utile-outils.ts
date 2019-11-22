import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtile } from './commande-utile';
import { KfVueTableFiltreNombre } from '../commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { DetailCommande } from './detail-commande';
import { KfVueTableFiltreCherche } from '../commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { KfVueTableFiltreTexte } from '../commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { IdEtatDetailCommande, EtatDetailCommande } from './etat-detail-commande';
import {
    KfListeDeroulanteTexte,
    KfListeDeroulanteNombre
} from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { Commande } from './commande';
import { LivraisonProduit } from '../fournisseur/livraisons/livraison-produit';
import { DataUtileOutils } from '../commun/data-par-key/data-utile-outils';
import { KfVueTable } from '../commun/kf-composants/kf-vue-table/kf-vue-table';
import { Categorie } from '../modeles/catalogue/categorie';

export class CommandeUtileOutils extends DataUtileOutils {
    constructor(commandeUtile: CommandeUtile) {
        super(commandeUtile);
    }

    get commandeUtile(): CommandeUtile {
        return this._dataUtile as CommandeUtile;
    }

    get urlUtile(): CommandeUtileUrl {
        return this.commandeUtile.url;
    }

    get lienUtile(): CommandeUtileLien {
        return this.commandeUtile.lien;
    }

    get nomOutil(): {
        client: string,
        catégorie: string,
        produit: string,
        préparation: string,
    } {
        return {
            client: 'client',
            produit: 'produit',
            catégorie: 'catégorie',
            préparation: 'préparation',
        };
    }

    client(): KfVueTableFiltreCherche<DetailCommande> {
        return Fabrique.vueTable.cherche<DetailCommande>(this.nomOutil.client, 'Client',
            (détail: DetailCommande) => détail.client.nom, 'Rechercher un client');
    }

    produit(): KfVueTableFiltreCherche<DetailCommande> {
        return Fabrique.vueTable.cherche<DetailCommande>(this.nomOutil.produit, 'Produit',
            (détail: DetailCommande) => détail.produit.nom, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<DetailCommande> {
        return Fabrique.vueTable.filtreNombre<DetailCommande>(this.nomOutil.catégorie, 'Catégorie',
            (détail: DetailCommande, noCategorie: number) => détail.produit.categorieNo === noCategorie, 'Filtrer par catégorie');
    }
    chargeCatégories(vueTable: KfVueTable<DetailCommande>, catégories: Categorie[]) {
        const outil = vueTable.outils.outil(this.nomOutil.catégorie);
        const liste: KfListeDeroulanteNombre = outil.composant as KfListeDeroulanteNombre;
        catégories.forEach((c: Categorie) => liste.créeEtAjouteOption(c.nom, c.no));
    }

    préparation(): KfVueTableFiltreTexte<DetailCommande> {
        const filtre = Fabrique.vueTable.filtreTexte<DetailCommande>(this.nomOutil.préparation,
            'Etat',
            (détail: DetailCommande, idEtat: IdEtatDetailCommande) => {
                return EtatDetailCommande.étatDeId(idEtat).vérifie(détail);
            },
            'Filtrer par préparation');
        const liste: KfListeDeroulanteTexte = filtre.liste as KfListeDeroulanteTexte;
        EtatDetailCommande.liste.forEach(e => liste.créeEtAjouteOption(e.texte, e.valeur));
        return filtre;
    }

    clientDeCommandes(): KfVueTableFiltreCherche<Commande> {
        return Fabrique.vueTable.cherche<Commande>(this.nomOutil.client, 'Client',
            (commande: Commande) => commande.client.nom, 'Rechercher un client');
    }
    produitDeProduits(): KfVueTableFiltreCherche<LivraisonProduit> {
        return Fabrique.vueTable.cherche<LivraisonProduit>(this.nomOutil.produit, 'Produit',
            (livraisonProduit: LivraisonProduit) => livraisonProduit.produit.nom, 'Rechercher un produit');
    }
    catégorieDeProduits(): KfVueTableFiltreNombre<LivraisonProduit> {
        return Fabrique.vueTable.filtreNombre<LivraisonProduit>(this.nomOutil.catégorie, 'Catégorie',
            (lp: LivraisonProduit, noCategorie: number) => lp.produit.categorieNo === noCategorie, 'Filtrer par catégorie');
    }

}
