import { KeyUidNoEditeur } from '../../commun/data-par-key/key-uid-no/key-uid-no-editeur';
import { DataChamp } from '../../commun/data-par-key/data-champ';
import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfRadios } from '../../commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfListeDeroulante } from '../../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { Role } from './role';

export class RoleEditeur extends KeyUidNoEditeur {
    etiquetteType: KfEtiquette;
    type: KfRadios;
    fournisseur: KfListeDeroulante;

    groupeValeur: KfGroupe;

    créeAutresChamps() {
        this.groupeValeur = new KfGroupe('');
        this.autresChamps = [];
        let champ: DataChamp;

        const etiquetteType = new KfEtiquette('etiquetteType');
        champ = new DataChamp();
        champ.composant = etiquetteType;
        this.autresChamps.push(champ);

        const type = new KfRadios('type');
        type.AjouteChoix('administrateur', 'A', 'Administrateur');
        type.AjouteChoix('fournisseur', 'F', 'Fournisseur');
        type.AjouteChoix('client', 'C', 'Client');
        type.AjouteValidateur(KfValidateurs.required);
        type.visibiliteFnc = () => type.valeur === undefined;
        champ = new DataChamp();
        champ.composant = type;
        this.autresChamps.push(champ);
        this.type = type;

        const fournisseur = new KfListeDeroulante('fournisseur', 'Fournisseur');
        champ = new DataChamp();
        champ.composant = fournisseur;
        this.autresChamps.push(champ);
        this.fournisseur = fournisseur;

        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        nom.AjouteValidateur(KfValidateurs.doublon(nom.nom));
        champ = new DataChamp();
        champ.composant = nom;
        this.autresChamps.push(champ);
        const adresse = new KfTexte('adresse', 'Adresse');
        adresse.AjouteValidateur(KfValidateurs.longueurMax(200));
        champ = new DataChamp();
        champ.composant = adresse;
        this.autresChamps.push(champ);
    }

    fixeFournisseurs(fournisseurs: Role[]) {
        fournisseurs.forEach(fournisseur => {
            this.fournisseur.ajouteOption(fournisseur.nom, fournisseur.key);
        })
    }

    visibleSiTypeChoisi(): boolean {
        return this.type !== undefined;
    }

    traiteTypeChange(evenement: KfEvenement) {
        if (evenement.emetteur === this.type) {

        }
    }

    get valeur(): any {
        return this.edition.valeur;
    }

    set valeur(valeur: any) {
        this.edition.valeur = valeur;
    }

}
