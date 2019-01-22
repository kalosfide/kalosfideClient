import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ProduitPages, ProduitModifRoutes, ProduitModifPages } from './produit-pages';
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
import { KfTypeDeBaliseDEtiquette } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { SiteRoutes, SitePages } from 'src/app/site/site-pages';
import { ProduitService } from 'src/app/modeles/produit.service';
import { VisiteurRoutes, VisiteurPages } from 'src/app/visiteur/visiteur-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ProduitAccueilComponent extends FormulaireComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = ProduitPages.accueil;
    pageDef: PageDef = ProduitPages.accueil;

    site: Site;

    consulter: KfBouton;
    editer: KfBouton;

    constructor(
        protected attenteAsyncService: AttenteAsyncService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitService,
        private siteService: SiteService,
    ) {
        super(service, attenteAsyncService);
    }

    soumission: () => Observable<ApiResult> = () => {
        return this.siteService.ferme(this.site, new Date());
    }

    actionSiOk: () => void = () => {
        this.router.navigate([ProduitModifRoutes.url(this.site.nomSite, [ProduitModifPages.index.urlSegment])]);
    }

    créeBoutonsDeFormulaire: () => KfBouton[] = () => {
        return [FormulaireFabrique.CréeBoutonSoumettre(this.formulaire, 'Modifier les produits')];
    }

    créeEdition: () => KfGroupe = () => {
        const edition = new KfGroupe(this.nom);
        let etiquette = new KfEtiquette('',
            `Vous pouvez ouvrir la page Produits en mode consultation ou en mode modification.`);
        etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        edition.ajoute(etiquette);
        etiquette = new KfEtiquette('',
            `En mode consultation, vous verrez la page qui est présentée aux visiteurs et aux clients.`);
        etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        edition.ajoute(etiquette);
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('nav');
        this.consulter = new KfBouton('consulter', 'Consulter les produits');
        this.consulter.ajouteClasseDef('btn', 'btn-primary');
        groupe.ajoute(this.consulter);
        groupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, (evenement: KfEvenement) => {
            if (evenement.emetteur.nom === this.consulter.nom) {
                this.router.navigate([VisiteurRoutes.url(this.site.nomSite, [VisiteurPages.produits.urlSegment])]);
            }
            evenement.statut = KfStatutDEvenement.fini;
        });
        edition.ajoute(groupe);

        etiquette = new KfEtiquette('',
            `En mode modification, vous pourrez créer et modifier les produits et les catégories et fixer les prix.`);
        etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        edition.ajoute(etiquette);
        etiquette = new KfEtiquette('',
            `Avant les modifications, les commandes en cours sont arrêtées et les nouvelles commandes suspendues`);
        etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        edition.ajoute(etiquette);
        return edition;
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.créeFormulaire();
    }

}
