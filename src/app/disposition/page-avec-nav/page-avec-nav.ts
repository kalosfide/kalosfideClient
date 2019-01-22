

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';

import { SectionDeNavigation } from './section-de-navigation';

export abstract class PageAvecNav {

    sections: SectionDeNavigation[] = [];

    navigation: KfSuperGroupe;

    abstract nom: string;

    nomPrecedent = 'precedent';
    textePrecedent = 'Précédent';
    nomSuivant = 'suivant';
    texteSuivant = 'Suivant';

    nomSoumettre = 'soumettre';
    texteSoumettre = 'Terminer';

    AjouteSection(nom: string, titre: string, route: any) {
        const section = new SectionDeNavigation(this.sections.length, nom, titre, route);
        section.parent = this;
        this.sections.push(section);
    }

    activeSection(index: number) {
        const etape = this.sections[index];
        etape.boutonNavigation.ajouteClasseDef('active');
        const buttonNav = etape.boutonNavigation.gereHtml.htmlElement;
        buttonNav.setAttribute('aria-selected', 'true');
    }

    désactiveEtape(index: number) {
        const etape = this.sections[index];
        etape.boutonNavigation.supprimeClasseDef('active');
        const buttonNav = etape.boutonNavigation.gereHtml.htmlElement;
        buttonNav.setAttribute('aria-selected', 'false');
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.clic) {
            const nom = evenement.emetteur.nom;
            let index: number;
            if (nom.slice(0, this.nomPrecedent.length - 1) === this.nomPrecedent) {
                index = Number.parseInt(nom.slice(this.nomPrecedent.length)) - 1;
            } else {
                if (nom.slice(0, this.nomSuivant.length - 1) === this.nomSuivant) {
                    index = Number.parseInt(nom.slice(this.nomSuivant.length)) + 1;
                }
            }
            this.changeIndex(index);
        }
    }

    get index(): number {
        return this.sections.findIndex(e => !!e.boutonNavigation.trouveClasse('active'));
    }
    changeIndex(nouvelIndex: number) {
        const index = this.index;
        if (index !== -1) {
            this.désactiveEtape(index);
        }
        this.activeSection(nouvelIndex);
    }

}
