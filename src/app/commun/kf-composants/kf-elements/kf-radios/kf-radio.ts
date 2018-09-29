import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfRadios } from './kf-radios';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfElement } from '../../kf-composant/kf-element';
import { KfEntrée } from '../../kf-composant/kf-entree';

export class KfRadio extends KfElement {

    _valeur: any;

    constructor(nom: string, valeur: string,
            texte?: string, imageAvant?: string, imageApres?: string) {
        super(nom, KfTypeDeComposant.radio, texte, imageAvant, imageApres);
        this._valeur = valeur;
    }

    get valeur(): any {
        return this._valeur;
    }

    get radios(): KfRadios {
         return <KfRadios>this.parent;
    }

}
