import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { SitePages } from './site-pages';
import { PageDef } from '../commun/page-def';
import { SiteBaseComponent } from './site-base.component';
import { Router } from '@angular/router';

@Component({
    templateUrl: './site-base.html',
})
export class SiteLivraisonsComponent extends SiteBaseComponent implements OnInit {

    static _pageDef: PageDef = SitePages.livraisons;
    pageDef: PageDef = SitePages.livraisons;

    actionClient = '';
    actionFournisseur: '';

    constructor(
        protected router: Router,
        protected service: NavigationService,
    ) {
        super(router, service);
    }

    ngOnInit() {
        this.ngOnInit_Site();
    }

}
