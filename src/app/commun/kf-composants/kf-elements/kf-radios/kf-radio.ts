import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfRadios } from './kf-radios';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfRadio extends KfElement {

    _valeur: any;

    constructor(nom: string, valeur: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.radio);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this._valeur = valeur;
    }

    get valeur(): any {
        return this._valeur;
    }

    get radios(): KfRadios {
         return <KfRadios>this.parent;
    }

}
