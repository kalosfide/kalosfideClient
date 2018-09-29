import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { DialogueDef } from '../../../dialogue/dialogueDef';
import { isFunction } from 'util';

export class KfLien extends KfElement {

    private _route: string | (() => string);
    private _dialogueConfirme: DialogueDef | (() => DialogueDef);
    actionSiConfirme: () => void;

    constructor(nom: string,
        route: string | (() => string),
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string),
        dialogueConfirme?: DialogueDef | (() => DialogueDef),
        actionSiConfirme?: () => void,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this._route = route ? route : '';
        this._dialogueConfirme = dialogueConfirme;
        this.actionSiConfirme = actionSiConfirme;
        if (texte || imageAvant || imageApres) {
            this.fixeTexte(texte);
            this.fixeImageAvant(imageAvant);
            this.fixeImageApres(imageApres);
        } else {
            this.fixeTexte('');
        }
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
        this.ajouteClasse('kf-lien kf-bouton');
    }

    get route(): string {
        return typeof (this._route) === 'string' ? this._route : this._route();
    }

    get dialogueConfirme(): DialogueDef {
        const d = this._dialogueConfirme;
        if (d) {
            return isFunction(d) ? (d as () => DialogueDef)() : d as DialogueDef;
        }
    }

    get avecConfirme(): boolean {
        return !!this._dialogueConfirme;
    }

}
