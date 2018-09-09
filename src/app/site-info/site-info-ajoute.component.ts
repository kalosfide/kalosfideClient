import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SiteInfoService } from './site-info.service';
import { KfTexte } from '../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../helpers/kf-composants/kf-partages/kf-validateur';
import { ApiResult } from '../helpers/api-results/api-result';
import { SiteInfoActionComponent } from './site-info-action.component';
import { KfBouton } from '../helpers/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../helpers/kf-composants/kf-composants-types';
import { KfLien } from '../helpers/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    selector: 'app-site-info-index',
    templateUrl: '../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class SiteInfoAjouteComponent extends SiteInfoActionComponent {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService
    ) {
        super(router, route, service);
        this.nom = 'siteinfo';
        this.titre = 'Ajouter un nouveau site';

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Ajouter')];

        this.lienRetour = new KfLien('lienRetour', '..', 'Retour à la liste');

        this.soumission = (): Observable<ApiResult> => {
            return this.siteInfoService.ajoute(this.formulaire.formGroup.value);
        };

        this.titreRésultatErreur = 'Ajout impossible';
    }

    _créeContenus() {
        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        this.contenus.push(nom);
        const titre = new KfTexte('titre', 'Titre');
        titre.AjouteValidateur(KfValidateurs.longueurMax(200));
        this.contenus.push(titre);
        const date = new KfTexte('date', 'Date');
        date.AjouteValidateur(KfValidateurs.longueurMin(4));
        date.AjouteValidateur(KfValidateurs.longueurMax(4));
        this.contenus.push(date);
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

}
