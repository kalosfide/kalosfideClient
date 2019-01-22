import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfListeDeroulante } from '../../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { Categorie } from '../../modeles/categorie';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export enum TypeCacheProduits {
    aucun = '0',
    avecCommande = '1',
    sansCommande = '2',
}

export class CommandeLigneFiltre {
    groupe: KfGroupe;

    listeCategorieNo: KfListeDeroulante;
    listeCacher: KfListeDeroulante;

    constructor() {
        this.groupe = new KfGroupe('filtre');
        this.groupe.créeGereValeur();
        this.groupe.estRacineV = true;
        this.listeCategorieNo = new KfListeDeroulante('categorieNo', 'Filtrer par catégorie');
        this.listeCategorieNo.ajouteClasseDef('mb-2 mr-sm-2');
        this.listeCategorieNo.gereHtml.suitLaValeur = true;
        this.groupe.ajoute(this.listeCategorieNo);

        this.listeCacher = new KfListeDeroulante('cacherDisponibles', 'Filtrer les produits');
        this.listeCacher.ajouteOption('avec commande', TypeCacheProduits.avecCommande);
        this.listeCacher.ajouteOption('sans commande', TypeCacheProduits.sansCommande);
        this.listeCacher.ajouteClasseDef('mb-2 mr-sm-2');
        this.listeCacher.gereHtml.suitLaValeur = true;
        this.groupe.ajoute(this.listeCacher);

        this.groupe.ajouteClasseDef('form-inline');
    }

    get categorieNo(): number {
        return Number.parseInt(this.listeCategorieNo.abstractControl.value);
    }

    chargeCategories(categories: Categorie[]) {
        if (categories.length === 0) {
            this.groupe.visibilite = false;
        } else {
            categories.forEach(c => {
                this.listeCategorieNo.ajouteOption(c.nom, c.no);
            });
            this.listeCategorieNo.valeur = -1;
        }
    }

    get cacheProduits(): TypeCacheProduits {
        return this.listeCacher.abstractControl.value;
    }

}
