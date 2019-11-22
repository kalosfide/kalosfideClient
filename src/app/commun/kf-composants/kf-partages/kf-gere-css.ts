import { KfTexteDef, ValeurTexteDef } from './kf-texte-def';
import { KfNgClasse, KfNgClasseDef } from './kf-gere-css-classe';
import { KfNgStyle, KfNgStyleDef } from './kf-gere-css-style';
import { Observable, Subscription } from 'rxjs';
import { KfInitialObservable } from './kf-initial-observable';

class KfNePasAfficher {
    private _valeur: boolean;
    private _initialObservable: KfInitialObservable<boolean>;
    private _subscription: Subscription;

    constructor(initialObservable: KfInitialObservable<boolean>) {
        this._valeur = initialObservable.valeur;
        this._initialObservable = initialObservable;
        if (initialObservable.observable) {
            this._subscription = initialObservable.observable.subscribe((valeur: boolean) => this._valeur = valeur);
        }
    }

    get valeur(): boolean {
        return this._valeur;
    }
}

export class KfGèreCss {
    /**
     * valeur initiale et Observable définissant si les filtres sont affichés
     */
    private _nePasAfficher: boolean;
    private _subscriptionAfficher: Subscription;

    private _ngInvisible: KfNgClasseDef;

    private _classeDefs: KfTexteDef[];

    private _ngClasseDefs: KfNgClasseDef[];

    private _styleDefs: KfNgStyleDef[];

    private _subscriptionInvisible: Subscription;

    private _suitLaVisiblité: KfGèreCss;
    private _suitLesClasses: KfGèreCss;
    private _suitLeStyle: KfGèreCss;

    suitLaVisiblité(gèreCss: KfGèreCss) {
        this._suitLaVisiblité = gèreCss;
    }

    suitLesClasses(gèreCss: KfGèreCss) {
        this._suitLesClasses = gèreCss;
    }

    suitClassesEtStyle(gèreCss: KfGèreCss) {
        this._suitLesClasses = gèreCss;
        this._suitLeStyle = gèreCss;
    }

    // NE PAS AFFICHER

    afficherSi(condition?: KfInitialObservable<boolean>) {
        if (this._subscriptionAfficher) {
            this._subscriptionAfficher.unsubscribe();
        }
        if (condition) {
            this._nePasAfficher = !condition.valeur;
            this._subscriptionAfficher = condition.observable.subscribe(c => this._nePasAfficher = !c);
        }
    }

    nePasAfficherSi(condition: KfInitialObservable<boolean>) {
        if (this._subscriptionAfficher) {
            this._subscriptionAfficher.unsubscribe();
        }
        if (condition) {
            this._nePasAfficher = condition.valeur;
            this._subscriptionAfficher = condition.observable.subscribe(c => this._nePasAfficher = c);
        }
    }

    get nePasAfficher(): boolean {
        return this._nePasAfficher;
    }
    set nePasAfficher(nePasAfficher: boolean) {
        this._nePasAfficher = nePasAfficher;
    }

    // VISIBILITE

    get ngInvisible(): KfNgClasseDef {
        return this._suitLaVisiblité
            ? this._suitLaVisiblité._ngInvisible
            : this._ngInvisible;
    }

    get _visible(): boolean {
        return !this._ngInvisible || (this._ngInvisible.active && !this._ngInvisible.active());
    }

    get visible(): boolean {
        if (this._suitLaVisiblité) {
            return this._suitLaVisiblité.visible;
        } else {
            return !this._ngInvisible || (this._ngInvisible.active && !this._ngInvisible.active());
        }
    }

    set visible(visible: boolean) {
        this._ngInvisible = visible
            ? undefined
            : {
                nom: 'kf-invisible',
            };
    }

    set invisibilitéFnc(invisibilitéFnc: () => boolean) {
        this._ngInvisible = {
            nom: 'kf-invisible',
            active: invisibilitéFnc
        };
    }

    set visibilitéFnc(visibilitéFnc: () => boolean) {
        this._ngInvisible = {
            nom: 'kf-invisible',
            active: () => !visibilitéFnc()
        };
    }

    set visibilitéObs(visibilitéObs: Observable<boolean>) {
        if (this._subscriptionInvisible) {
            this._subscriptionInvisible.unsubscribe();
        }
        this._subscriptionInvisible = visibilitéObs.subscribe(visible => {
            console.log(2, visible);
            this.visible = visible;
        });
    }

    set invisibilitéObs(invisibilitéObs: Observable<boolean>) {
        if (this._subscriptionInvisible) {
            this._subscriptionInvisible.unsubscribe();
        }
        this._subscriptionInvisible = invisibilitéObs.subscribe(visible => this.visible = !visible);
    }

    set visibilitéIO(visibilitéIO: KfInitialObservable<boolean>) {
        this.visible = visibilitéIO.valeur;
        this.visibilitéObs = visibilitéIO.observable;
    }

    set invisibilitéIO(invisibilitéIO: KfInitialObservable<boolean>) {
        this.visible = !invisibilitéIO.valeur;
        this.invisibilitéObs = invisibilitéIO.observable;
    }

    // CLASSES

    private _créeArray(nomsDef: string | string[]): string[] {
        if (typeof (nomsDef) === 'string') {
            return nomsDef.trim().split(' ');
        } else {
            let noms: string[] = [];
            nomsDef.forEach(n => noms = noms.concat(this._créeArray(n)));
            return noms;
        }
    }
    private _ajouteNg(nomsDef: string | string[] | { nom: string | string[], active?: () => boolean }) {
        if (!this._ngClasseDefs) {
            this._ngClasseDefs = [];
        }
        let noms = [];
        let active: () => boolean;
        if (typeof (nomsDef) === 'string' || Array.isArray(nomsDef)) {
            noms = this._créeArray(nomsDef);
        } else {
            noms = this._créeArray(nomsDef.nom);
            active = nomsDef.active;
        }
        noms.forEach(n => {
            let ngc = this._ngClasseDefs.find(ng => ng.nom === n);
            if (ngc) {
                ngc.active = active;
            } else {
                ngc = new KfNgClasseDef();
                ngc.nom = n;
                ngc.active = active;
                this._ngClasseDefs.push(ngc);
            }
        });
    }

    private _motsOuFonctions(classeDefs: KfTexteDef[]): KfTexteDef[] {
        const motsOuFonctions: KfTexteDef[] = [];
        classeDefs.forEach(
            classeDef => {
                if (typeof (classeDef) === 'string') {
                    const cs = classeDef.trim().split(' ');
                    if (cs.length > 0) {
                        cs.forEach(mot => motsOuFonctions.push(mot));
                    }
                } else {
                    motsOuFonctions.push(classeDef);
                }
            });
        return motsOuFonctions;
    }
    private _ajouteTexteDef(classeDef: KfTexteDef) {
        if (!this._classeDefs) {
            this._classeDefs = [];
        }
        this._motsOuFonctions([classeDef]).forEach(
            c => {
                if (!this._classeDefs.find(cd => c === cd)) {
                    this._classeDefs.push(c);
                }
            }
        );
    }

    private _ajouteClasseDef(classeDef: KfTexteDef | KfNgClasseDef) {
        if ((classeDef as KfNgClasseDef).nom) {
            const ng = classeDef as KfNgClasseDef;
            this._ajouteNg(ng);
        } else {
            this._ajouteTexteDef(classeDef as KfTexteDef);
        }
    }

    ajouteClasseDefArray(classeDefs: (KfTexteDef | KfNgClasseDef)[]): void {
        classeDefs.forEach(classeDef => this._ajouteClasseDef(classeDef));
    }
    ajouteClasseDef(...classeDefs: (KfTexteDef | KfNgClasseDef)[]): void {
        this.ajouteClasseDefArray(classeDefs);
    }

    supprimeClasseDefArray(classeDefs: KfTexteDef[]): void {
        const motsOuFonctions = this._motsOuFonctions(classeDefs);
        if (this._classeDefs) {
            this._classeDefs = this._classeDefs.filter(c => !motsOuFonctions.find(c1 => c1 === c));
            if (this._classeDefs.length === 0) {
                this._classeDefs = undefined;
            }
        }
    }
    supprimeClasseDef(...classeDefs: KfTexteDef[]): void {
        this.supprimeClasseDefArray(classeDefs);
    }

    ajouteClasseTemp(nomClasse: string, durée: number) {
        this.ajouteClasseDef(nomClasse);
        const idTimeOut = window.setTimeout(() => {
            this.supprimeClasseDef(nomClasse);
            clearTimeout(idTimeOut);
        }, durée);
    }

    supprimeClasseAPréfixe(préfixe: string) {
        const nb = préfixe.length;
        if (this._classeDefs) {
            this._classeDefs = this._classeDefs.filter(c => {
                const texte = ValeurTexteDef(c);
                return texte.length < nb || texte.slice(0, nb) !== préfixe;
            });
        }
        if (this._ngClasseDefs) {
            this._ngClasseDefs = this._ngClasseDefs.filter(ngc => {
                const texte = ValeurTexteDef(ngc.nom);
                return texte.length < nb || texte.slice(0, nb) !== préfixe;
            });
        }
    }

    private ngClasseSansInvisible(): KfNgClasse {
    let ngClasse: { [noms: string]: boolean | (() => boolean) };
    if (this._classeDefs && this._classeDefs.length > 0) {
        let classes = '';
        this._classeDefs.forEach(
            classeDef => {
                const texteClasse = typeof (classeDef) === 'string' ? classeDef : classeDef();
                const cs = texteClasse.split(' ');
                if (cs.length > 0) {
                    cs.forEach(classe => classes = classes + ' ' + classe);
                }
            });
        ngClasse = {};
        ngClasse[classes] = true;
    }
    if (this._ngClasseDefs && this._ngClasseDefs.length > 0) {
        if (!ngClasse) {
            ngClasse = {};
        }
        this._ngClasseDefs.forEach(
            ngClasseDef => ngClasse[ngClasseDef.nom] = !ngClasseDef.active || ngClasseDef.active()
        );
    }
    return ngClasse;
}

get classe(): KfNgClasse {
    let ngClasse: { [noms: string]: boolean | (() => boolean) };
    ngClasse = this._suitLesClasses ? this._suitLesClasses.ngClasseSansInvisible() : this.ngClasseSansInvisible();
    if (this.ngInvisible) {
        if (!ngClasse) {
            ngClasse = {};
        }
        ngClasse[this.ngInvisible.nom] = this.ngInvisible.active ? this.ngInvisible.active() : true;
    }
    return ngClasse;
}

fixeStyleDef(nom: string, valeur: KfTexteDef, active ?: () => boolean) {
    let def: KfNgStyleDef;
    if (this._styleDefs) {
        def = this._styleDefs.find(d => d.nom === nom);
    }
    if (!def) {
        def = new KfNgStyleDef();
        def.nom = nom;
        if (!this._styleDefs) {
            this._styleDefs = [];
        }
        this._styleDefs.push(def);
    }
    def.valeur = valeur;
    def.active = active;
}
supprimeStyleDef(nom: string) {
    const index = this._styleDefs.findIndex(d => d.nom === nom);
    if (index !== -1) {
        this._styleDefs.splice(index, 1);
        if (this._styleDefs.length === 0) {
            this._styleDefs = undefined;
        }
    }
}
effaceStyles() {
    this._styleDefs = undefined;
}

get style(): KfNgStyle {
    if (this._suitLeStyle) {
        return this._suitLeStyle.style;
    }
    if (this._styleDefs) {
        const defs = this._styleDefs.filter(d => !d.active || d.active());
        if (defs.length > 0) {
            const style: KfNgStyle = {};
            this._styleDefs.forEach(d => style[d.nom] = ValeurTexteDef(d.valeur));
            return style;
        }
    }
}


get avecClassesOuStyle(): boolean {
    return !!this._classeDefs || !!this._ngClasseDefs || !!this._styleDefs;
}

copieClassesEtStyle(gereCss: KfGèreCss) {
    if (gereCss._classeDefs) {
        this._classeDefs = gereCss._classeDefs.map(def => def);
    }
    if (gereCss._ngClasseDefs) {
        this._ngClasseDefs = gereCss._ngClasseDefs.map(def => def);
    }
    if (gereCss._styleDefs) {
        this._styleDefs = gereCss._styleDefs.map(def => def.clone());
    }
}
}
