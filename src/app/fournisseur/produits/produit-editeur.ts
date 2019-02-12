import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { Produit } from 'src/app/modeles/produit';
import { KfListeDeroulante } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { ProduitService } from 'src/app/modeles/produit.service';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { TypesMesures } from 'src/app/modeles/type-mesure';
import { TypesCommandes } from 'src/app/modeles/type-commande';
import { Categorie } from 'src/app/modeles/categorie';

export class ProduitEditeur extends KeyUidRnoNoEditeur<Produit> {
    listeCategorieNo: KfListeDeroulante;

    créeAutresChamps(action: string) {
        this.keyAuto = true;

        const categorieNo = new KfListeDeroulante('categorieNo', 'Catégorie');
        categorieNo.ajouteValidateur(KfValidateurs.required);
        this.listeCategorieNo = categorieNo;

        const nom: KfComposant = new KfInputTexte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        nom.ajouteValidateur(KfValidateurs.longueurMax(200));
        nom.ajouteValidateur(KfValidateurs.validateurDoublon('nomPris', 'Ce nom est déjà pris'));

        const typeMesure = new KfListeDeroulante('typeMesure', 'Unité de mesure');
        TypesMesures.Mesures.forEach(mesure => typeMesure.ajouteOption(mesure.texteListe(), mesure.valeur));
        typeMesure.nullImpossible = true;
        typeMesure.valeur = TypesMesures.ALaPièce.valeur;

        const typeCommande = new KfListeDeroulante('typeCommande', 'Mode de commande');
        TypesCommandes.Commandes.forEach(commande => typeCommande.ajouteOption(commande.texteListe(), commande.valeur));
        typeCommande.nullImpossible = true;
        typeCommande.valeur = TypesCommandes.ALUnité.valeur;

        this.ajoute(categorieNo, nom, typeMesure, typeCommande);
    }

    chargeCategories(categories: Categorie[]) {
        categories.forEach(c => {
            this.listeCategorieNo.ajouteOption(c.nom, c.no);
        });
        this.listeCategorieNo.valeur = categories[0].no;
    }
}
