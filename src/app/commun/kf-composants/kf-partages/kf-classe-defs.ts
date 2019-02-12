import { KfTexteDef } from './kf-texte-def';

export class KfClasseDefs {
    private _classeDefs: KfTexteDef[] = [];

    static créeClasses(classeDefs: KfTexteDef[]): string[] {
        const classes: string[] = [];
        classeDefs.forEach(
            classeDef => {
                const texteClasse = typeof (classeDef) === 'string' ? classeDef : classeDef();
                const cs = texteClasse.split(' ');
                if (cs.length > 0) {
                    cs.forEach(classe => classes.push(classe));
                }
            });
        return classes;
    }

    static motsOuFonctions(classeDefs: KfTexteDef[]): KfTexteDef[] {
        const motsOuFonctions: KfTexteDef[] = [];
        classeDefs.forEach(
            classeDef => {
                if (typeof (classeDef) === 'string') {
                    const cs = classeDef.split(' ');
                    if (cs.length > 0) {
                        cs.forEach(mot => motsOuFonctions.push(mot));
                    }
                } else {
                    motsOuFonctions.push(classeDef);
                }
            });
        return motsOuFonctions;
    }

    trouveClasseDef(classeDef: KfTexteDef): KfTexteDef {
        return this._classeDefs.find(c => classeDef === c);
    }
    trouveClasse(classe: string): KfTexteDef {
        return this.classes.find(c => classe === c);
    }
    ajouteClasseDef(classeDefs: KfTexteDef[]) {
        KfClasseDefs.motsOuFonctions(classeDefs).forEach(
            classeDef => {
                if (!this.trouveClasseDef(classeDef)) {
                    this._classeDefs.push(classeDef);
                }
            }
        );
    }
    supprimeClasseDef(classeDefs: KfTexteDef[]) {
        this._classeDefs = this._classeDefs.filter(c => !KfClasseDefs.motsOuFonctions(classeDefs).find(c1 => c1 === c));
    }

    get classes(): string[] {
        return KfClasseDefs.créeClasses(this._classeDefs);
    }

    get classe(): string {
        return ' ' + this.classes.join(' ');
    }

}
