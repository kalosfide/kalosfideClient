import { OnInit, OnDestroy } from '@angular/core';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';


import { DataService } from '../../services/data.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { PageBaseComponent } from '../page-base/page-base.component';
import { soumet, FormulaireASoumettre, SoumissionDef, créeFormulaireASoumettre } from './i-formulaire';

export abstract class FormulairesComponent extends PageBaseComponent implements OnInit, OnDestroy {

    abstract soumissions: SoumissionDef[];

    lienRetour: KfLien;

    aSoumettre: FormulaireASoumettre[];

    get formulaires(): KfSuperGroupe[] {
        return this.aSoumettre.map(as => as.formulaire);
    }
    get superGroupes(): KfSuperGroupe[] {
        return this.formulaires;
    }

    edition: KfGroupe;

    boutonSoumettre: KfBouton;
    afficheResultat: KfAfficheResultat;

    constructor(
        protected service: DataService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super();
    }

    protected créeFormulaires() {
        this.aSoumettre = this.soumissions.map(s => créeFormulaireASoumettre(s));
    }

    ngOnInit() {
        this.créeFormulaires();
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            const formulaireASoumettre: FormulaireASoumettre = this.aSoumettre.find(fas => fas.formulaire === evenement.emetteur);
            if (formulaireASoumettre) {
                soumet(this.attenteAsyncService, formulaireASoumettre);
            }
        }
    }

}
