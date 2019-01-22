import { Component, OnInit, OnDestroy } from '@angular/core';
import { Site } from 'src/app/modeles/site';
import { NavigationService } from 'src/app/services/navigation.service';
import { SiteService } from 'src/app/modeles/site.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseDEtiquette } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ProduitRoutes, ProduitModifRoutes, ProduitModifPages } from './produit-pages';
import { FSiteRoutes, FSitePages } from '../f-sites/f-site-pages';

@Component({
    templateUrl: './produit-alerte.component.html'
})
export class ProduitModifComponent implements OnInit, OnDestroy {
    site: Site;
    subscription: Subscription;
    groupe: KfSuperGroupe;
    etiquetteRéouverture: KfEtiquette;

    constructor(
        private router: Router,
        private service: SiteService,
        private navigation: NavigationService,
    ) {}

    private créeSuperGroupe() {
        const groupe = new KfSuperGroupe('alerte');
        const etiquette = new KfEtiquette('', 'Votre site est fermé. Vos clients ne peuvent pas commander.');
        etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        groupe.ajoute(etiquette);
        this.etiquetteRéouverture = new KfEtiquette('', '');
        this.etiquetteRéouverture.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        groupe.ajoute(this.etiquetteRéouverture);
        const lien = new KfLien('',
            FSiteRoutes.url(this.site.nomSite, [FSitePages.ouverture.urlSegment]),
            FSitePages.ouverture.lien);
        groupe.ajoute(lien);
        this.groupe = groupe;
    }

    get réouvertureTexte(): string {
        if (this.site.etat === 'I') {
            return `Il n'y a pas de réouverture programmée.`;
        }
        const réouvre = this.site.dateEtat;
        const jour =  réouvre.toLocaleDateString('fr-FR');
        const heure = réouvre.toLocaleTimeString('fr-FR');
        return `La réouverture est prévue le ` + jour + ' à ' + heure;
    }

    ngOnInit() {
        this.site = this.navigation.siteEnCours;
        this.créeSuperGroupe();
        this.subscription = this.service.estOuvert$().subscribe(ouvert => {});
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
