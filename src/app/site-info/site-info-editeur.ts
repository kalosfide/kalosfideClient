import { KeyNumberEditeur } from '../commun/data-par-key/key-number/key-number-editeur';
import { DataChamp } from '../commun/data-par-key/data-champ';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';

export class SiteInfoEditeur extends KeyNumberEditeur {
    créeAutresChamps() {
        this.autresChamps = [];
        this.keyAuto = true;
        let champ: DataChamp;

        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        nom.AjouteValidateur(KfValidateurs.doublon(nom.nom));
        champ = new DataChamp();
        champ.composant = nom;
        this.autresChamps.push(champ);
        const titre = new KfTexte('titre', 'Titre');
        titre.AjouteValidateur(KfValidateurs.longueurMax(200));
        champ = new DataChamp();
        champ.composant = titre;
        this.autresChamps.push(champ);
        const date = new KfTexte('date', 'Date');
        date.AjouteValidateur(KfValidateurs.longueurMin(4));
        date.AjouteValidateur(KfValidateurs.longueurMax(4));
        champ = new DataChamp();
        champ.composant = date;
        this.autresChamps.push(champ);
    }
}
