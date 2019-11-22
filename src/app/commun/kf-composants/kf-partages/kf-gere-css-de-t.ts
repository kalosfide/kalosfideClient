import { KfNgClasse, KfNgClasseDefDe } from './kf-gere-css-classe';

export class KfGèreCssDe<T> {

    private _classeDefs: (string | ((t: T) => string))[];

    private _ngClasseDefs: KfNgClasseDefDe<T>[];

    // CLASSES

    private _ajouteClasseDef(classeDef: string | ((t: T) => string) | KfNgClasseDefDe<T>) {
        if ((classeDef as KfNgClasseDefDe<T>).nom) {
            const ng = classeDef as KfNgClasseDefDe<T>;
            if (!this._ngClasseDefs) {
                this._ngClasseDefs = [ng];
            } else {
                this._ngClasseDefs.push(ng);
            }
        } else {
            if (!this._classeDefs) {
                this._classeDefs = [];
            }
            if (typeof (classeDef) === 'string') {
                this._classeDefs.push(classeDef);
            } else {
                this._classeDefs.push(classeDef as (t: T) => string);
            }
        }
    }

    ajouteClasseDefArray(classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        classeDefs.forEach(classeDef => this._ajouteClasseDef(classeDef));
    }
    ajouteClasseDef(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        this.ajouteClasseDefArray(classeDefs);
    }

    classe(t: T): KfNgClasse {
        let ngClasse: { [noms: string]: boolean | (() => boolean) };
        if (this._classeDefs && this._classeDefs.length > 0) {
            let classes = '';
            this._classeDefs.forEach(
                classeDef => {
                    const texteClasse = typeof (classeDef) === 'string' ? classeDef : classeDef(t);
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
                ngClasseDef => ngClasse[ngClasseDef.nom] = !ngClasseDef.active || ngClasseDef.active(t)
            );
        }
        return ngClasse;
    }
}
