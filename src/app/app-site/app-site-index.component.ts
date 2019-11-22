import { Component, OnInit } from '@angular/core';
import { FormulaireComponent } from '../disposition/formulaire/formulaire.component';
import { PeupleService } from './peuple.service';
import { AppSitePages } from './app-site-pages';
import { PageDef } from '../commun/page-def';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfCaseACocher } from '../commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class AppSiteIndexComponent extends FormulaireComponent implements OnInit {

    static _pageDef: PageDef = AppSitePages.index;
    pageDef: PageDef = AppSitePages.index;

    private sansPeuple: KfCaseACocher;

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.groupeEdition('peuple');
        this.sansPeuple = Fabrique.caseACocher('sansPeuple');
//        this.sansPeuple.visible = false;
        this.sansPeuple.ajouteValidateur(KfValidateurs.requiredTrue);
        groupe.ajoute(this.sansPeuple);
        return groupe;
    }

    créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
        return [Fabrique.bouton.boutonSoumettre(formulaire, 'Peupler la BDD')];
    }
    actionSiOk = (): void => {
        this.sansPeuple.valeur = false;
    }
    apiDemande = (): Observable<ApiResult> => {
        return this.peupleService.peuple();
    }

    constructor(
        private route: ActivatedRoute,
        private peupleService: PeupleService,
    ) {
        super(peupleService);
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.formulaire = Fabrique.formulaire.formulaire(this);
                this.sansPeuple.valeur = !data.estPeuplé;
            }
        ));
    }

}
