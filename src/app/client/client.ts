import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { EtapeDeFormulaireEditeur } from '../disposition/formulaire/etape-de-formulaire';

export class ClientModel {
    nom: string;
    adresse: string;

    copieData(data: any) {
        this.nom = data['nom'];
        this.adresse = data['adresse'];
    }

    get model(): ClientModel {
        const model = new ClientModel();
        model.nom = this.nom;
        model.adresse = this.adresse;
        return model;
    }
    set model(model: ClientModel) {
        this.nom = model.nom;
        this.adresse = model.adresse;
    }

    get profil(): ClientProfil {
        return {
            nom: this.nom,
            adresse: this.adresse
        };
    }
    set profil(profil: ClientProfil) {
        this.nom = profil.nom;
        this.adresse = profil.adresse;
    }
}

export class ClientProfil {
    nom: string;
    adresse: string;
}

export class ClientEditeur implements EtapeDeFormulaireEditeur {

    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nom = new KfInputTexte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        champs.push(nom);
        const adresse = new KfInputTexte('adresse', 'Adresse');
        adresse.ajouteValidateur(KfValidateurs.required);
        champs.push(adresse);
        return champs;
    }
}

export class Client extends ClientModel implements IKeyUidRno {
    uid: string;
    rno: number;
    siteUid: string;
    siteRno: number;
}
