import { OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../../commun/kf-composants/kf-composants-types';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { EtapeDeFormulaire } from './etape-de-formulaire';

export abstract class FormulaireAEtapesComponent extends FormulaireBaseComponent implements OnInit, OnDestroy {

    abstract etapes: EtapeDeFormulaire[];
    etape: EtapeDeFormulaire;

    abstract actionSiOk: () => void;
    abstract soumission: () => Observable<ApiResult>;

    lienRetour: KfLien;

    superGroupe: KfSuperGroupe;

    boutonSoumettreAsync: KfBouton;
    afficheResultat: KfAfficheResultat;

    constructor(
        protected service: DataService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);
    }

    ngOnInit() {
        this.ngOnInit_TitreHtml();
        this.ngOnInit_CréeFormulaire();
        this.ngOnInit_Charge();
        this.etape = this.etapes[0];
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            this.attenteAsyncService.commence();
            this.afficheResultat.commence();
            const subscription = ApiResult.résultatSoumission$(
                this.formulaire,
                this.soumission(),
                this.titreRésultatErreur,
                this.titreRésultatSucces,
            ).subscribe(
                resultat => {
                    console.log(resultat);
                    subscription.unsubscribe();
                    this.attenteAsyncService.finit();
                    this.afficheResultat.finit(resultat);
                    if (resultat.type === KfTypeResultatAffichable.Ok) {
                        this.actionSiOk();
                    }
                }
            );
        }
    }

}
