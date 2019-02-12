import { Component } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from './app-site-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSite } from './app-site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfIcone } from '../commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { CODE_ACCEPTE, ICONE_ACCEPTER, CODE_REFUSE, ICONE_REFUSER } from '../fournisseur/f-commandes/f-commande';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../commun/kf-composants/kf-partages/kf-evenements';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfRadios } from '../commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { KfRadio } from '../commun/kf-composants/kf-elements/kf-radios/kf-radio';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfInputDate } from '../commun/kf-composants/kf-elements/kf-input/kf-input-date';
import { KfInputTemps } from '../commun/kf-composants/kf-elements/kf-input/kf-input-temps';
import { Dateur } from '../commun/outils/dateur';
import { KfInputDateTemps } from '../commun/kf-composants/kf-elements/kf-input/kf-input-date-temps';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteContactComponent extends PageBaseComponent {

    static _pageDef: PageDef = AppSitePages.contact;
    pageDef: PageDef = AppSitePages.contact;

    get titre(): string {
        return `Contacter ${AppSite.titre}`;
    }

    constructor() {
        super();
        this.créeContenus();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.estRacineV = true;
        this.superGroupe.avecInvalidFeedback = true;

        const dateTemps = new KfInputDateTemps('dateTemps', 'dateTemps');
        const d0 = new Date();
        const d1 = Dateur.ajouteHeures(d0, 1);
        dateTemps.valeur = d1;
        dateTemps.ajouteValidateur(KfValidateurs.validateurDeFn('maintenant_plus',
            (value: Date) => {
                const maintenant = new Date();
                return value.valueOf() <= maintenant.valueOf();
            },
            'La moment choisi est déjà passé.'));
        this.superGroupe.ajoute(dateTemps);

        this.superGroupe.sauveQuandChange = true;
        this.superGroupe.quandTousAjoutés();
    }

}
