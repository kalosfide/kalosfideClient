
import { Observable, Subscription } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { PageBaseComponent } from '../page-base/page-base.component';
import { IFormulaireBase, SoumissionDef, FormulaireASoumettre, soumet } from './i-formulaire';
import { FormulaireFabrique } from './formulaire-fabrique';
import { KfResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';

export abstract class FormulaireBaseComponent extends PageBaseComponent implements IFormulaireBase {

    titreRésultatErreur: string;
    titreRésultatSucces: string;

    abstract actionSiOk: () => void;
    actionSiErreur: (resultat: KfResultatAffichable) => void;
    abstract soumission: () => Observable<ApiResult>;

    // membres communs
    formulaire: KfSuperGroupe;
    edition: KfGroupe;

    subscriptions: Subscription[] = [];

    boutonSoumettre: KfBouton;
    afficheResultat: KfAfficheResultat;

    lienRetour: KfLien;

    constructor(
        protected service: DataService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super();
    }

    get superGroupe(): KfSuperGroupe {
        return this.formulaire;
    }

    get valeur(): any {
        return this.edition.formGroup.value;
    }
    set valeur(valeur: any) {
        this.edition.formGroup.setValue(valeur);
    }

    créeBoutonSoumettre(texte?: string): KfBouton {
        return FormulaireFabrique.CréeBoutonSoumettre(this.formulaire, texte);
    }

    soumet() {
        const àSoumettre: FormulaireASoumettre = {
            soumission: this.soumission,
            actionSiOk: this.actionSiOk,
            edition: this.edition,
            formulaire: this.formulaire,
            afficheResultat: this.afficheResultat,
            actionSiErreur: this.actionSiErreur,
            titreErreur: this.titreRésultatErreur,
            titreSucces: this.titreRésultatSucces
        };
        soumet(this.attenteAsyncService, àSoumettre, this.service.routeur);
    }
}
