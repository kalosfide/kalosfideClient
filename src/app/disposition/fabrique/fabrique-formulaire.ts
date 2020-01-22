import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { AfficheResultat } from '../affiche-resultat/affiche-resultat';
import { BootstrapType, FabriqueBootstrap } from './fabrique-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTypeDEvenement, KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';

export interface IFormulaireDef {
    nom: string;
    /** retourne les composants à afficher avant l'éditeur */
    avantEdition?: () => KfComposant[];
    /** retourne le groupe des composant à éditer */
    créeEdition: () => KfGroupe;

    créeBoutonsDeFormulaire?: (formulaire: KfSuperGroupe) => (KfBouton | KfLien)[];
    neSoumetPasSiPristine?: boolean;
    groupeBoutonsMessages?: GroupeBoutonsMessages;

    aprèsBoutons?: () => KfComposant[];
    /** défini après création */
    edition?: KfGroupe;
    /** défini après création */
    afficheResultat?: AfficheResultat;
}

export class GroupeBoutonsMessages {
    private _groupe: KfGroupe;
    private _boutons: (KfBouton | KfLien)[];
    private _messages: KfComposant[];

    constructor(nom: string, messages?: KfComposant[]) {
        const groupe = new KfGroupe(nom);
        if (messages) {
            const grRow = new KfGroupe(nom + '_msg');
            grRow.ajouteClasseDef('row justify-content-center');
            groupe.ajoute(grRow);
            const grCol = new KfGroupe('');
            grCol.ajouteClasseDef('col text-center');
            grRow.ajoute(grCol);
            messages.forEach(m => {
                grCol.ajoute(m);
            });
        }
        this._groupe = groupe;
        this._messages = messages;
    }

    get groupe(): KfGroupe { return this._groupe; }
    get boutons(): (KfBouton | KfLien)[] { return this._boutons; }
    get messages(): KfComposant[] { return this._messages; }

    créeBoutons(boutons: (KfBouton | KfLien)[]) {
        if (this.boutons) {
            throw new Error('GroupeBoutonsMessages: boutons existe déjà.');
        }
        this._boutons = boutons;
        if (boutons.length > 0) {
            const grRow = new KfGroupe(this.groupe.nom + '_btn');
            this.groupe.ajoute(grRow);
            grRow.ajouteClasseDef('row justify-content-center');
            let grCol: KfGroupe;
            boutons.forEach(b => {
                grCol = new KfGroupe('');
                grCol.ajouteClasseDef('col-sm');
                grCol.ajoute(b);
                grRow.ajoute(grCol);
            });
        }
    }

    alerte(alerte: BootstrapType) {
        FabriqueBootstrap.ajouteClasse(this.groupe, 'alert', alerte);
    }

}

export class FabriqueFormulaire extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    formulaire(def: IFormulaireDef): KfSuperGroupe {
        const formulaire = new KfSuperGroupe(def.nom);

        const test = new KfEtiquette('', 'Test');
        test.baliseHtml = KfTypeDeBaliseHTML.p;
        test.fixeStyleDef('backgroundcolor', 'red');
        formulaire.ajoute(test);

        if (def.avantEdition) {
            def.avantEdition().forEach(c => formulaire.ajoute(c));
        }
        def.edition = def.créeEdition();
        if (def.edition.gereValeur) {
            formulaire.créeGereValeur();
            formulaire.sauveQuandChange = true;
            formulaire.neSoumetPasSiPristine = def.neSoumetPasSiPristine;
        }
        formulaire.ajoute(def.edition);

        if (def.groupeBoutonsMessages) {
            formulaire.ajoute(def.groupeBoutonsMessages.groupe);
            if (def.créeBoutonsDeFormulaire) {
                def.groupeBoutonsMessages.créeBoutons(def.créeBoutonsDeFormulaire(formulaire));
                def.afficheResultat = this.ajouteResultat(formulaire);
                formulaire.ajoute(def.afficheResultat.groupe);
            }
        } else {
            if (def.créeBoutonsDeFormulaire) {
                def.groupeBoutonsMessages = new GroupeBoutonsMessages(formulaire.nom);
                def.groupeBoutonsMessages.créeBoutons(def.créeBoutonsDeFormulaire(formulaire));
                formulaire.ajoute(def.groupeBoutonsMessages.groupe);
                def.afficheResultat = this.ajouteResultat(formulaire);
                formulaire.ajoute(def.afficheResultat.groupe);
            }
        }

        if (def.aprèsBoutons) {
            def.aprèsBoutons().forEach(c => formulaire.ajoute(c));
        }

        if (def.edition.gereValeur) {
            formulaire.avecInvalidFeedback = true;
            formulaire.quandTousAjoutés();
        }
        return formulaire;
    }

    groupeEdition(nom: string): KfGroupe {
        const groupe = new KfSuperGroupe(nom);
        groupe.créeGereValeur();
        return groupe;
    }

    ajouteResultat(formulaire: KfGroupe): AfficheResultat {
        const afficheResultat = new AfficheResultat(formulaire);
        return afficheResultat;
    }

}
