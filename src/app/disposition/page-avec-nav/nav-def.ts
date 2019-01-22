import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';

export class NavDef {
    nom: string;
    texte?: string;
    image?: string;
    route: any;
    etat: string;

    bouton: KfBouton;

    constructor(nom: string, route: any, texte?: string) {
        this.nom = nom;
        this.route = route;
        this.texte = texte;
    }
}
