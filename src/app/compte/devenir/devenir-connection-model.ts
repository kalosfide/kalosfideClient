import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { DevenirService } from './devenir.service';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';

export class DevenirConnectionModel {
    email: string;
    password: string;
}

export class DevenirConnectionEditeur implements EtapeDeFormulaireEditeur {
    kfTexteDuMotDePasse: KfTexte;

    constructor(service: DevenirService) {
    }

    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        const email = new KfTexte('email', 'Adresse mail');
        email.typeDInput = KfTypeDInput.email;
        email.AjouteValidateur(KfValidateurs.required);
        email.AjouteValidateur(KfValidateurs.email);
        email.AjouteValidateur(KfValidateurs.validateur(
            'emailPris',
            null,
            'Il y a déjà un utilisateur enregistré avec cette adresse'
        ));
        email.texteRemplissage = 'ex: admin@kalosfide.fr';
        champs.push(email);
        this.kfTexteDuMotDePasse = new KfTexte('password', 'Mot de passe');
        this.kfTexteDuMotDePasse.typeDInput = KfTypeDInput.password;
        this.kfTexteDuMotDePasse.AjouteValidateur(KfValidateurs.required);
        champs.push(this.kfTexteDuMotDePasse);
        const confirme = new KfTexte('confirme', 'Confirmation du mot de passe');
        confirme.typeDInput = KfTypeDInput.password;
        confirme.AjouteValidateur(KfValidateurs.required);
        const validateur = KfValidateurs.aLaValeurDe(this.kfTexteDuMotDePasse);
        validateur.message = 'La confirmation ne correspond pas au mot de passe.';
        confirme.AjouteValidateur(validateur);
        champs.push(confirme);
        return champs;
    }

}
