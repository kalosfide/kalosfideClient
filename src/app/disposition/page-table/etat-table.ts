import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ILienDef } from '../fabrique/fabrique-lien';
import { BootstrapType } from '../fabrique/fabrique-bootstrap';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from '../fabrique/fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTypeContenuPhrasé } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';

export enum EtatTableType {
    toujoursAffiché = 1,
    remplaceTableSiVide
}

export class EtatTable {
    private _groupe: KfGroupe;
    private _etiquette: KfEtiquette;
    private _bootstrapType: BootstrapType;

    constructor() {
        this._groupe = new KfGroupe('etatTable');
        this._etiquette = new KfEtiquette('message');
        this._etiquette.fixeTexte('');
        this._etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        this._groupe.ajoute(this._etiquette);
    }

    get groupe(): KfGroupe { return this._groupe; }

    initialise(message?: string, lienDef?: ILienDef, bootstrapType?: BootstrapType) {
        const contenus: KfTypeContenuPhrasé[] = [];
        if (message) {
            const texte = new KfTexte('', message);
            contenus.push(texte);
        }
        if (lienDef) {
            const lien = Fabrique.lien.lien(lienDef);
            contenus.push(lien);
        }
        this._etiquette.contenuPhrase.contenus = contenus;
        if (bootstrapType) {
            if (this._bootstrapType) {
                this._groupe.supprimeClasseDef('alert-' + this._bootstrapType);
            } else {
                this._groupe.ajouteClasseDef('alert');
            }
            this._groupe.ajouteClasseDef('alert-' + bootstrapType);
            this._bootstrapType = bootstrapType;
        }
    }
}
