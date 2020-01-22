import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtileLien } from './document-utile-lien';
import { DocumentUtile } from './document-utile';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import {
    KfListeDeroulanteTexte,
    KfListeDeroulanteNombre
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { Categorie } from '../catalogue/categorie';
import { LigneDocument } from './ligne-base';
import { DocCLF } from './document';
import { IdEtatLigneDocument, EtatLigneDocument } from './ligne-etat';

export class DocumentUtileOutils extends DataUtileOutils {
    constructor(utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this._dataUtile as DocumentUtile;
    }

    get urlUtile(): DocumentUtileUrl {
        return this.utile.url;
    }

    get lienUtile(): DocumentUtileLien {
        return this.utile.lien;
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

    client(): KfVueTableFiltreCherche<LigneDocument> {
        return Fabrique.vueTable.cherche<LigneDocument>(this.nomOutil.client, 'Client',
            (détail: LigneDocument) => détail.client.nom, 'Rechercher un client');
    }

    produit(): KfVueTableFiltreCherche<LigneDocument> {
        return Fabrique.vueTable.cherche<LigneDocument>(this.nomOutil.produit, 'Produit',
            (détail: LigneDocument) => détail.produit.nom, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<LigneDocument> {
        return Fabrique.vueTable.filtreNombre<LigneDocument>(this.nomOutil.catégorie, 'Catégorie',
            (détail: LigneDocument, noCategorie: number) => détail.produit.categorieNo === noCategorie, 'Filtrer par catégorie');
    }
    chargeCatégories(vueTable: KfVueTable<LigneDocument>, catégories: Categorie[]) {
        const outil = vueTable.outils.outil(this.nomOutil.catégorie);
        const liste: KfListeDeroulanteNombre = outil.composant as KfListeDeroulanteNombre;
        catégories.forEach((c: Categorie) => liste.créeEtAjouteOption(c.nom, c.no));
    }

    préparation(): KfVueTableFiltreTexte<LigneDocument> {
        const filtre = Fabrique.vueTable.filtreTexte<LigneDocument>(this.nomOutil.préparation,
            'Etat',
            (détail: LigneDocument, idEtat: IdEtatLigneDocument) => {
                return EtatLigneDocument.étatDeId(idEtat).vérifie(détail);
            },
            'Filtrer par préparation');
        const liste: KfListeDeroulanteTexte = filtre.liste as KfListeDeroulanteTexte;
        EtatLigneDocument.liste.forEach(e => liste.créeEtAjouteOption(e.texte, e.valeur));
        return filtre;
    }

    clientDeCommandes(): KfVueTableFiltreCherche<DocCLF> {
        return Fabrique.vueTable.cherche<DocCLF>(this.nomOutil.client, 'Client',
            (commande: DocCLF) => commande.client.nom, 'Rechercher un client');
    }

}
