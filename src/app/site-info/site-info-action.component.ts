import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormulaireComponent } from '../helpers/formulaire/formulaire.component';
import { SiteInfoService } from './site-info.service';
import { KfNombre } from '../helpers/kf-composants/kf-elements/kf-nombre/kf-nombre';
import { KfTexte } from '../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs, KfValidateur } from '../helpers/kf-composants/kf-partages/kf-validateur';
import { KfComposant } from '../helpers/kf-composants/kf-composant/kf-composant';
import { KfLien } from '../helpers/kf-composants/kf-elements/kf-lien/kf-lien';
import { Observable } from 'rxjs';
import { ApiResult } from '../helpers/api-results/api-result';
import { map } from 'rxjs/operators';
import { ApiResult200Ok } from '../helpers/api-results/api-result-200-ok';

@Component({
    templateUrl: '../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class SiteInfoActionComponent extends FormulaireComponent {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService
    ) {
        super(service);
        this.nom = 'siteinfo';

        const id = new KfNombre('id');
        id.gereVisible.visibilite = false;
        this.contenus.push(id);
        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        nom.AjouteValidateur(KfValidateurs.doublon(nom.nom));
        this.contenus.push(nom);
        const titre = new KfTexte('titre', 'Titre');
        titre.AjouteValidateur(KfValidateurs.longueurMax(200));
        this.contenus.push(titre);
        const date = new KfTexte('date', 'Date');
        date.AjouteValidateur(KfValidateurs.longueurMin(4));
        date.AjouteValidateur(KfValidateurs.longueurMax(4));
        this.contenus.push(date);

        this.actionSiOk = (): void => {
            this.router.navigate(['..']);
        };
    }

    get siteInfoService(): SiteInfoService {
        return this.service as SiteInfoService;
    }

    _initialiseFormulaire(): Observable<boolean> {
        return this.route.data.pipe(map(
            site => {
                let jsonSite = JSON.stringify(site);
                const début = jsonSite.indexOf('{', jsonSite.indexOf('{') + 1);
                jsonSite = jsonSite.slice(début, jsonSite.length - 1);
                const sitejson = JSON.parse(jsonSite);
                this.formulaire.gereValeur.rétablit(sitejson);
                this.formulaire.formGroup.reset(sitejson);
                return true;
            }
        ));
    }
}
