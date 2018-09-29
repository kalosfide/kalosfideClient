import { Component } from '@angular/core';



import { SiteInfoService } from './site-info.service';
import { SiteInfo } from './site-info';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../services/titreHtml.service';
import { AttenteAsyncService } from '../services/attenteAsync.service';
import { KeyNumberIndexComponent } from '../commun/data-par-key/key-number/key-number-index.component';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-site-info-index',
    templateUrl: '../disposition/page-base/page-base.component.html',
    styles: []
})
export class SiteInfoIndexComponent extends KeyNumberIndexComponent<SiteInfo> {

    nom = 'siteinfo_liste';
    titreHtml = 'Siteinfo - liste';
    titre = 'Liste des sites';

    colonnes = ['Nom', 'Titre', 'Date'];
    cellules = (ligne: SiteInfo): (string | KfComposant[])[] => {
        return [ligne.nom, ligne.titre, ligne.date, [
            this.créeLienEdite(ligne),
            this.créeLienSupprime(ligne),
        ]];
    }
    choisie = (): boolean => false;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: SiteInfoService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
    }

    get siteInfos(): SiteInfo[] { return this.liste as SiteInfo[]; }

}
