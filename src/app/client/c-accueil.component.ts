import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { ClientPages } from './client-pages';
import { SiteAccueilComponent } from '../site/site-accueil.component';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class CAccueilComponent extends SiteAccueilComponent implements OnInit {

    static _pageDef: PageDef = ClientPages.accueil;
    pageDef: PageDef = ClientPages.accueil;

    constructor(
        protected service: NavigationService,
    ) {
        super(service);
    }

}
