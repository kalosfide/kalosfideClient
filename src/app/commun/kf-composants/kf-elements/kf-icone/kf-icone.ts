import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfNombreDef, ValeurNombreDef } from '../../kf-partages/kf-nombre-def';
import { KfIconeDef, ValeurIconeDef } from '../../kf-partages/kf-icone-def';

export enum TypeEchelleIcone {
    grandit = 'grow',
    réduit = 'shrink'
}

export enum TypePositionHIcone {
    droite = 'right',
    gauche = 'left'
}

export enum TypePositionVIcone {
    bas = 'down',
    haut = 'up'
}

export enum TypeRotationIcone {
    rotate = 'rotate'
}

export enum TypeSymétrieIcone {
    horizontal = 'flip-h',
    vertical = 'flip-v',
    lesDeux = 'both',
}

export interface IKfIcone {
    largeurFixe: boolean;

    inverse: boolean;

    echelleType: TypeEchelleIcone;
    echelleValeur: number;
    positionHType: TypePositionHIcone;
    positionHValeur: number;
    positionVType: TypePositionVIcone;
    positionVValeur: number;

    rotation: number;
    symetrie: TypeSymétrieIcone;

    style: { [keys: string]: any };
}

class KfIconeBase extends KfElement implements IKfIcone {
    iconeDef: KfIconeDef;
    texteDef: KfTexteDef;
    nombreDef: KfNombreDef;

    largeurFixe: boolean;

    inverse: boolean;

    echelleType: TypeEchelleIcone;
    echelleValeur: number;
    positionHType: TypePositionHIcone;
    positionHValeur: number;
    positionVType: TypePositionVIcone;
    positionVValeur: number;

    rotation: number;
    symetrie: TypeSymétrieIcone;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.icone);
    }

    get fa_icon(): IconDefinition {
        return ValeurIconeDef(this.iconeDef);
    }


    get texte(): string {
        if (this.texteDef) {
            return ValeurTexteDef(this.texteDef);
        }
    }

    get nombre(): number {
        if (this.nombreDef) {
            return ValeurNombreDef(this.nombreDef);
        }
    }

    get transform(): string {
        const t: string[] = [];
        if (this.echelleType) {
            t.push(this.echelleType + '-' + this.echelleValeur);
        }
        if (this.positionHType) {
            t.push(this.positionHType + '-' + this.positionHValeur);
        }
        if (this.positionVType) {
            t.push(this.positionVType + '-' + this.positionVValeur);
        }
        if (this.rotation) {
            t.push('rotate-' + this.rotation);
        }
        if (t.length !== 0) {
            return t.join(' ');
        }
    }
}

export class KfIcone extends KfIconeBase {

    avecClic: boolean;
    couches: KfIconeBase[];

    constructor(nom: string, iconeDef: KfIconeDef, avecClic?: boolean) {
        super(nom);
        this.iconeDef = iconeDef;
        this.avecClic = avecClic;
        if (avecClic) {
            // évènement du span conteneur
            this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        }
    }

    ajoute(composant: KfComposant) {
        throw new Error('On ne peut pas ajouter à une icone');
    }

    _empile(): KfIconeBase {
        if (!this.couches) {
            this.couches = [];
        }
        const icone = new KfIconeBase(this.nom + (this.couches.length + 1));
        this.couches.push(icone);
        return icone;
    }

    empileIcone(iconeDef: IconDefinition): IKfIcone {
        const icone = this._empile();
        icone.iconeDef = iconeDef;
        return icone;
    }

    empileTexte(texteDef: KfTexteDef): IKfIcone {
        const icone = this._empile();
        icone.texteDef = texteDef;
        return icone;
    }

    empileNombre(nombreDef: KfNombreDef): IKfIcone {
        const icone = this._empile();
        icone.nombreDef = nombreDef;
        return icone;
    }
}
