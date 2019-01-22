import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { isFunction } from 'util';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { Params } from '@angular/router';

export class KfLien extends KfElement {

    private _route: KfTexteDef;

    queryParams?: Params | null;

    constructor(nom: string,
        route: KfTexteDef,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this._route = route ? route : '';
        this.fixeTexteUrlImage(texte, imageAvant, imageApres);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
        this.ajouteClasseDef('kf-lien kf-bouton');
    }

    get route(): string {
        return ValeurTexteDef(this._route);
    }

    fixeRoute(route: KfTexteDef) {
        this._route = route;
    }

}
