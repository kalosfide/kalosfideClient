import { Component, OnInit } from '@angular/core';
import { Site } from '../modeles/site';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { SiteAccueilComponent } from '../site/site-accueil.component';
import { FournisseurPages } from './fournisseur-pages';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class FAccueilComponent extends SiteAccueilComponent implements OnInit {

    static _pageDef: PageDef = FournisseurPages.accueil;
    pageDef: PageDef = FournisseurPages.accueil;

    constructor(
        protected service: NavigationService,
    ) {
        super(service);
    }

}
