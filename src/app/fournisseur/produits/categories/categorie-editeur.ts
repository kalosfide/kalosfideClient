import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { Categorie } from 'src/app/modeles/categorie';
import { CategorieService } from 'src/app/modeles/categorie.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';

export class CategorieEditeur extends KeyUidRnoNoEditeur<Categorie> {
    créeAutresChamps(action: string) {
        this.keyAuto = true;

        const nom: KfComposant = new KfInputTexte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        nom.ajouteValidateur(KfValidateurs.longueurMax(200));
        nom.ajouteValidateur(KfValidateurs.validateurDoublon('nomPris', 'Ce nom est déjà pris'));

        this.ajoute(nom);
    }
}
