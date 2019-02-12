import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { Params } from '@angular/router';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfLien extends KfElement {

    private _url: KfTexteDef;
    private _params?: any;

    queryParams?: Params | null;

    constructor(nom: string,
        url?: KfTexteDef,
        texte?: KfTexteDef,
    ) {
        super(nom, KfTypeDeComposant.lien);
        this._url = url;
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
    }

    get url(): string {
        return ValeurTexteDef(this._url);
    }

    get route(): any {
        const route: any[] = [this.url];
        if (this._params) {
            route.push(this._params);
        }
        return route;
    }

    fixeRoute(url: KfTexteDef, params?: any) {
        this._url = url;
        this._params = params;
    }

}
