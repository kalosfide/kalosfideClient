import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SiteInfoService } from './site-info.service';
import { ApiResult } from '../helpers/api-results/api-result';
import { SiteInfoActionComponent } from './site-info-action.component';
import { KfBouton } from '../helpers/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../helpers/kf-composants/kf-composants-types';
import { KfLien } from '../helpers/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class SiteInfoEditeComponent extends SiteInfoActionComponent {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService
    ) {
        super(router, route, service);
        this.titre = 'Editer le site';

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Mettre à jour')];

        this.lienRetour = new KfLien('lienRetour', '../..', 'Retour à la liste');

        this.initialiseFormulaire = () => this._initialiseFormulaire();

        this.soumission = (): Observable<ApiResult> => {
                return this.service.edite(this.formulaire.formGroup.value);
        };

        this.titreRésultatErreur = 'Mise à jour impossible';
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

}
