import { KfGèreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';

export enum Couleur {
    blue = '#007bff',
    indigo = '#6610f2',
    purple = '#6f42c1',
    pink = '#e83e8c',
    red = '#dc3545',
    orange = '#fd7e14',
    yellow = '#ffc107',
    green = '#28a745',
    teal = '#20c997',
    cyan = '#17a2b8',
    white = '#fff',
    gray = '#6c757d',
    gray_dark = '#343a40',
    primary = '#007bff',
    secondary = '#6c757d',
    success = '#28a745',
    info = '#17a2b8',
    warning = '#ffc107',
    danger = '#dc3545',
    light = '#f8f9fa',
    dark = '#343a40',
    blanchedalmond = 'blanchedalmond',
    beige = 'beige',
    whitesmoke = 'whitesmoke',
}

interface ICouleur { nom: string; rgb: string; }

export class FabriqueCouleur {
    private _couleurs: ICouleur[];
    private _préfixe = 'couleur';
    private _préfixe_fond = 'couleur-fond';

    constructor() {
        this._couleurs = [];
        for (const key in Couleur) {
            if (Couleur.hasOwnProperty(key)) {
                const element = Couleur[key];
                this._couleurs.push({ nom: key, rgb: element });
            }
        }
    }

    private _icouleur(couleur: Couleur): ICouleur {
        const icouleur = this._couleurs.find(ic => ic.rgb === couleur);
        if (!icouleur) {
            throw new Error('ajouteClasseCouleur');
        }
        return icouleur;
    }

    private _classe(préfixe: string, couleur: Couleur): string {
        const icouleur = this._icouleur(couleur);
        return `${préfixe}-${icouleur.nom}`;
    }

    private _ajouteClasse(gèreCss: KfGèreCss, préfixe: string, couleur: Couleur, active?: () => boolean) {
        const classeCouleur = this._classe(préfixe, couleur);
        gèreCss.supprimeClasseAPréfixe(préfixe);
        gèreCss.ajouteClasseDef({ nom: classeCouleur, active: active });
    }

    classeCouleur(couleur: Couleur): string {
        return this._classe(this._préfixe, couleur);
    }

    ajouteClasseCouleur(gèreCss: KfGèreCss, couleur: Couleur, active?: () => boolean) {
        this._ajouteClasse(gèreCss, this._préfixe, couleur, active);
    }

    supprimeClasseCouleur(gèreCss: KfGèreCss) {
        gèreCss.supprimeClasseAPréfixe(this._préfixe + '-');
    }

    classeCouleurFond(couleur: Couleur): string {
        return this._classe(this._préfixe_fond, couleur);
    }

    ajouteClasseCouleurFond(gèreCss: KfGèreCss, couleur: Couleur, active?: () => boolean) {
        this._ajouteClasse(gèreCss, this._préfixe_fond, couleur, active);
    }

    supprimeClasseCouleurFond(gèreCss: KfGèreCss) {
        gèreCss.supprimeClasseAPréfixe(this._préfixe_fond + '-');
    }

    test1(): string {
        let t = '';
        this._couleurs.forEach(c => t += `
.${this._préfixe}-${c.nom} {
    color: ${c.rgb};
}
`);
        return t;
    }

    test(): string {
        let t = '';
        this._couleurs.forEach(c => t += `
    .${this._préfixe}-${c.nom},`);
        return `button:disabled {${t} {
        color: inherit;
    }
}`;
    }

}

export function testCouleur() {
    const fabrique = new FabriqueCouleur();
    console.log(fabrique.test());
}
