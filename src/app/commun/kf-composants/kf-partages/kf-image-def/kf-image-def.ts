import { KfTexteDef, ValeurTexteDef } from '../kf-texte-def';
import { KfNombreDef, ValeurNombreDef } from '../kf-nombre-def';
import { KfClasseDefs } from '../kf-classe-def';

export class KfImageDef {
    urlDef: KfTexteDef;
    largeurDef?: KfNombreDef;
    hauteurDef?: KfNombreDef;

    private _classeDefs: KfClasseDefs;

    constructor(urlDef: KfTexteDef) {
        this.urlDef = urlDef;
    }

    get url(): string {
        return ValeurTexteDef(this.urlDef);
    }

    get avecLargeur(): boolean {
        return !!this.largeurDef;
    }

    get largeur(): number {
        return ValeurNombreDef(this.largeurDef);
    }

    get avecHauteur(): boolean {
        return !!this.hauteurDef;
    }

    get hauteur(): number {
        return ValeurNombreDef(this.hauteur);
    }

    // CSS
    trouveClasse(classe: string): KfTexteDef {
        return this._classeDefs.trouveClasse(classe);
    }
    ajouteClasseDef(...classeDefs: KfTexteDef[]) {
        if (!this._classeDefs) {
            this._classeDefs = new KfClasseDefs();
        }
        this._classeDefs.ajouteClasseDef(classeDefs);
    }
    supprimeClasseDef(...classeDefs: KfTexteDef[]) {
        this._classeDefs.supprimeClasseDef(classeDefs);
    }

    get classe(): string {
        return this._classeDefs ? this._classeDefs.classe : '';
    }
}
