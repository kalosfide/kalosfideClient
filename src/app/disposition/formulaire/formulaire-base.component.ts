
import { Observable, Subscription } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { AfficheResultat } from '../affiche-resultat/affiche-resultat';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';

import { PageBaseComponent } from '../page-base/page-base.component';
import { ResultatAction } from 'src/app/disposition/affiche-resultat/resultat-affichable';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { RouteurService } from 'src/app/services/routeur.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { NavigationService } from 'src/app/services/navigation.service';

export abstract class FormulaireBaseComponent extends PageBaseComponent {

    titreRésultatErreur: string;
    titreRésultatSucces: string;

    abstract actionSiOk: () => void;
    actionSiErreur: (resultat: ResultatAction) => void;
    abstract apiDemande: () => Observable<ApiResult>;

    // membres communs
    formulaire: KfSuperGroupe;
    edition: KfGroupe;

    subscriptions: Subscription[] = [];

    boutonSoumettre: KfBouton;
    afficheResultat: AfficheResultat;

    constructor(
        protected _service: DataService,
    ) {
        super();
    }

    get identification(): IdentificationService { return this._service.identification; }
    get routeur(): RouteurService { return this._service.routeur; }
    get navigation(): NavigationService { return this._service.navigation; }

    get superGroupe(): KfSuperGroupe {
        return this.formulaire;
    }

    get valeur(): any {
        return this.edition.formGroup.value;
    }
    set valeur(valeur: any) {
        this.edition.formGroup.setValue(valeur);
    }

    soumet() {
        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: this.apiDemande,
            actionSiOk: this.actionSiOk,
            formulaire: this.formulaire,
            afficheResultat: this.afficheResultat,
            actionSiErreur: this.actionSiErreur,
            titreErreur: this.titreRésultatErreur,
            titreSucces: this.titreRésultatSucces
        };
        this._service.action(apiRequêteAction);
    }
}
