import { Component, OnInit, OnDestroy } from '@angular/core';
import { Site } from 'src/app/modeles/site';
import { NavigationService } from 'src/app/services/navigation.service';
import { SiteService } from 'src/app/modeles/site.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    templateUrl: './produit-modif.component.html'
})
export class ProduitModifComponent implements OnInit, OnDestroy {
    site: Site;
    subscription: Subscription;

    constructor(
        private router: Router,
        private service: SiteService,
        private navigation: NavigationService,
    ) {}

    ngOnInit() {
        this.site = this.navigation.siteEnCours;
        this.subscription = this.service.estOuvert$().subscribe(ouvert => {});
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
