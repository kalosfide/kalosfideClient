import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfDivTableColonne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';

export interface ITitrePage {
    // pour toolbar enlever?
    titre: string;
    /** pour une page contenue dans une page titre */
    niveau?: number;

    // pour toolbar enlever?
    /** si page titre, à afficher à droite du titre */
    complement?: KfComposant;
}

export class TitrePage {
    groupe: KfGroupe;

    constructor(iTitrePage: ITitrePage) {
        this.créeGroupe(iTitrePage);
    }

    niveauTitreBase = 5;
    niveauTitreMax = 6;

    get classeDiv(): string {
        const classes = ['titre-page', 'row', 'align-items-center', 'couleur-fond-beige', 'px-1', 'py-1', 'mb-2'];
        return classes.join(' ');
    }

    créeGroupe(iTitrePage: ITitrePage) {
        this.groupe = new KfGroupe('titre');
        this.groupe.créeDivLigne();
        this.groupe.divLigne.ajouteClasseDef(this.classeDiv);

        let col: KfDivTableColonne;

        let niveau = this.niveauTitreBase + (iTitrePage.niveau ? iTitrePage.niveau : 0);
        if (niveau > this.niveauTitreMax) {
            niveau = this.niveauTitreMax;
        }
        col = this.groupe.divLigne.ajoute(iTitrePage.titre);
        col.ajouteClasseDef('col h' + niveau);

        if (iTitrePage.complement) {
            col = this.groupe.divLigne.ajoute(iTitrePage.complement);
            col.ajouteClasseDef('col');
        }

    }
}
