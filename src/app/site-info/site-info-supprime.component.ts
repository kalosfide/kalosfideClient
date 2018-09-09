import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SiteInfoService } from './site-info.service';
import { ApiResult } from '../helpers/api-results/api-result';
import { ValidationErrors } from '@angular/forms';
import { SiteInfoActionComponent } from './site-info-action.component';
import { KfBouton } from '../helpers/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../helpers/kf-composants/kf-composants-types';
import { KfLien } from '../helpers/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class SiteInfoSupprimeComponent extends SiteInfoActionComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService
    ) {
        super(router, route, service);
        this.nom = 'siteinfo';
        this.titre = 'Supprimer le site';

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Supprimer')];

        this.initialiseFormulaire = () => {
            this.contenus.forEach(c => {
                const f = c.formulaireParent;
                console.log({ nom: c.nom, inactif: c.inactif });
                console.log({ nom: f.nom, inactif: f.inactif });
                if (c !== this.formulaire.groupeBoutonsDeFormulaire) {
                    c.désactive();
                }
                console.log({ nom: c.nom, inactif: c.inactif });
                console.log({ nom: f.nom, inactif: f.inactif });
            });
            this.formulaire.active();
            console.log(this.formulaire.contenus.map(c => ({ nom: c.nom, inactif: c.inactif })));
            const error: ValidationErrors = {};
            error['ASupprimer'] = true;
            this.formulaire.formGroup.setErrors(error);
            this.formulaire.formGroup.markAsDirty();
            console.log(this.formulaire.contenus.map(c => ({ nom: c.nom, inactif: c.inactif })));
            const result = this._initialiseFormulaire();
            return result;
        };

        this.lienRetour = new KfLien('lienRetour', '../..', 'Retour à la liste');

        this.soumission = (): Observable<ApiResult> => {
            return this.siteInfoService.supprime(this.formulaire.formGroup.value);
        };

        this.titreRésultatErreur = 'Suppression impossible';
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

}
