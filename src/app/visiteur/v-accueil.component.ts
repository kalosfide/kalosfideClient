import { Component, OnInit } from '@angular/core';
import { Site } from '../modeles/site';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { VisiteurPages } from './visiteur-pages';
import { SiteAccueilComponent } from '../site/site-accueil.component';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class VAccueilComponent extends SiteAccueilComponent implements OnInit {

    static _pageDef: PageDef = VisiteurPages.accueil;
    pageDef: PageDef = VisiteurPages.accueil;

    constructor(
        protected service: NavigationService,
    ) {
        super(service);
    }

}
