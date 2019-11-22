import { Component, OnInit } from '@angular/core';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { Site } from 'src/app/modeles/site';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { SitePages, SiteRoutes } from 'src/app/site/site-pages';
import { ActivatedRoute } from '@angular/router';
import { AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';
import { IdentificationService } from '../securite/identification.service';
import { KfUlComposant } from '../commun/kf-composants/kf-ul/kf-ul-composant';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class AppSiteSitesComponent extends PageBaseComponent implements OnInit {

    static _pageDef = AppSitePages.sites;
    pageDef = AppSitePages.sites;

    get titre(): string {
        return `${AppSite.titre} - ${this.pageDef.titre}`;
    }

    sites: Site[];

    constructor(
        private route: ActivatedRoute,
        private identification: IdentificationService,
    ) {
        super();
    }

    private créeContenus() {
        const identifiant = this.identification.litIdentifiant();
        this.superGroupe = new KfSuperGroupe(this.nom);
        if (this.sites.length > 0) {
            const ul_li = new KfUlComposant(this.nom);
            this.sites.forEach(site => {
                ul_li.ajoute(new KfLien(site.nomSite,
                    SiteRoutes.urlSite(site.nomSite, identifiant, [SitePages.accueil.urlSegment]), site.titre + site.etat));
            });
            this.superGroupe.ajoute(ul_li);
        } else {
//            const afficheRésultat = Fabrique.afficheResultatFixe('sites', TypeResultatAffichable.Avertissement, 'Aucun site fournisseur');
//            this.superGroupe.ajoute(afficheRésultat.groupe);
        }
    }

    ngOnInit() {
        this.route.data.subscribe((data: { sites: Site[] }) => {
            this.sites = data.sites;
            this.créeContenus();
        });
    }

}
