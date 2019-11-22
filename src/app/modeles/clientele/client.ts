import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { EtapeDeFormulaireEditeur } from '../../disposition/formulaire/etape-de-formulaire';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KeyUidRnoEditeur } from '../../commun/data-par-key/key-uid-rno/key-uid-rno-editeur';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DataKeyALESComponent } from '../../commun/data-par-key/data-key-ales.component';
import { compareMinuscules } from '../../commun/outils/compare';

export interface IClientData {
    nom: string;
    adresse?: string;
}

export class ClientData implements IClientData {
    nom: string;
    adresse?: string;

    copieData(data: IClientData) {
        this.nom = data.nom;
        this.adresse = data.adresse;
    }

    get model(): ClientData {
        const model = new ClientData();
        model.nom = this.nom;
        model.adresse = this.adresse;
        return model;
    }
    set model(model: ClientData) {
        this.nom = model.nom;
        this.adresse = model.adresse;
    }
}

export class Client extends KeyUidRno implements IClientData {
    // key du client
    nom: string;
    adresse?: string;
    etat: string;
    dateEtat: Date;
    avecCompte: boolean;
    avecCommandes: boolean;

    /**
     * recopie les champs hors clé qui sont définis
     * @param de Client
     */
    static copieData(de: IClientData, vers: Client) {
        vers.nom = de.nom;
        vers.adresse = de.adresse;
    }
}

export const ClientChamps: { [key: string]: () => KfComposant } = {
    nom: () => {
        const nom = Fabrique.input.texte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        return nom;
    },
    adresse: () => {
        const adresse = Fabrique.input.texte('adresse', 'Adresse');
        return adresse;
    },
    etat: () => {
        const etat = Fabrique.input.texte('etat');
        return etat;
    }
};

export enum ClientEditeurOption {
    duClient = 'duClient',
    ajoute = 'ajoute',
    edite = 'edite',
    accepte = 'accepte',
    exclut = 'exclure',
}

export class ClientEditeurBase extends KeyUidRnoEditeur<Client> implements EtapeDeFormulaireEditeur {
    nom: KfInputTexte;

    protected ajouteNom(champs: KfComposant[]): KfInputTexte {
        this.nom = Fabrique.input.texte('nom', 'Nom');
        this.nom.ajouteValidateur(KfValidateurs.required);
        champs.push(this.nom);
        return this.nom;
    }
    protected ajouteAdresse(champs: KfComposant[]): KfInputTexte {
        const adresse = Fabrique.input.texte('adresse', 'Adresse');
        champs.push(adresse);
        return adresse;
    }

    /**
     * retourne l'array tous les champs hors key et etat, avecCompte
     * utilisé par l'étape de devenir client, par l'éditeur du client
     * surchargé dans l'éditeur pour le fournisseur
     */
    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        this.ajouteNom(champs);
        const adresse = this.ajouteAdresse(champs);
        adresse.ajouteValidateur(KfValidateurs.required);
        return champs;
    }

    /**
     * utilisé par le client pour editer son compte
     * @param component est ClientClientEditeComponent
     */
    créeAutresChamps(component: DataKeyALESComponent<Client>) {
        // lors d'un ajout, la clé est créée par la base de données
        this.keyAuto = true;
        this.créeContenus().forEach(composant => {
            this.ajoute(composant);
        });
    }
}
