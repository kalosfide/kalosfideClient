import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { PageAvecNav } from './page-avec-nav';
import { KfTypeDEvenement, KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';

export class SectionDeNavigation {
    parent: PageAvecNav;
    index: number;

    nom: string;
    texte: string;
    route: any;

    boutonNavigation: KfBouton;
    navigation: KfGroupe;
    groupeEtat: KfGroupe;
    etat: KfEtiquette;

    constructor(index: number, nom: string, texte: string, route: any) {
        this.index = index;
        this.nom = nom;
        this.texte = texte;
    }

    créeNavigation(): KfGroupe {
        this.navigation = new KfGroupe(this.nom);
        this.boutonNavigation = new KfBouton('bouton', this.texte);
        this.boutonNavigation.ajouteClasseDef('nav-link');
        this.boutonNavigation.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, (evenement: KfEvenement) => evenement.parametres = this.index);
        this.navigation.ajoute(this.boutonNavigation);
        return this.navigation;
    }

    créeGroupeEtat(): KfGroupe {
        this.groupeEtat = new KfGroupe(this.nom + 'etat');
        const etiquette = new KfEtiquette('', this.texte);
        etiquette.ajouteClasseDef('');
        this.groupeEtat.ajoute(etiquette);
        this.etat = new KfEtiquette('', '');
        this.etat.fixeTexte(() => this.estInitial ? '' : this.estValide ? 'Ok' : 'INVALIDE');
        this.etat.ajouteClasseDef(() => this.estInitial ? '' : this.estValide ? 'success' : 'danger');
        this.groupeEtat.ajoute(this.etat);
        return this.groupeEtat;
    }

    get estValide(): boolean {
        return true;
    }

    get estInitial(): boolean {
        return true;
    }

}

