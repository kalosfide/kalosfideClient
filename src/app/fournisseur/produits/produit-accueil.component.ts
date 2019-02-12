import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ProduitPages, ProduitRoutes } from './produit-pages';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { SiteService } from 'src/app/modeles/site.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { FormulaireFabrique } from 'src/app/disposition/formulaire/formulaire-fabrique';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ProduitService } from 'src/app/modeles/produit.service';
import { FournisseurRoutes } from '../fournisseur-pages';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { FSitePages, FSiteRoutes } from '../f-site/f-site-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ProduitAccueilComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = ProduitPages.accueil;
    pageDef: PageDef = ProduitPages.accueil;

    site: Site;

    constructor(
        protected attenteAsyncService: AttenteAsyncService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        private siteService: SiteService,
    ) {
        super();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        const message = Fabrique.messageSiteOuvert();
        this.superGroupe.ajoute(message.groupe);

        let etiquette = new KfEtiquette('',
            `Vous pouvez voir votre page Produits telle qu'elle est présentée aux visiteurs et aux clients.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        this.superGroupe.ajoute(etiquette);
        let groupe = new KfGroupe('');
        groupe.ajouteClasseDef('nav');
        let lien = Fabrique.lien(ProduitPages.visite, ProduitRoutes, this.site.nomSite);
        lien.contenuPhrase.fixeTexte('Voir les produits');
        lien.ajouteClasseDef('btn', 'btn-primary');
        groupe.ajoute(lien);
        this.superGroupe.ajoute(groupe);

        etiquette = new KfEtiquette('',
            `Pour pouvoir créer et modifier les produits et les catégories et fixer les prix, vous devez fermer le site.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        this.superGroupe.ajoute(etiquette);
        groupe = new KfGroupe('');
        groupe.ajouteClasseDef('nav');
        lien = Fabrique.lien(FSitePages.ouverture, FSiteRoutes, this.site.nomSite);
        lien.contenuPhrase.fixeTexte('Fermer le site');
        lien.ajouteClasseDef('btn', 'btn-primary');
        groupe.ajoute(lien);
        this.superGroupe.ajoute(groupe);
        return this.superGroupe;
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        if (!this.site.ouvert) {
            this.router.navigate([ProduitRoutes.url(this.site.nomSite, [ProduitPages.index.urlSegment])]);
        }
        this.créeContenus();
    }

}
