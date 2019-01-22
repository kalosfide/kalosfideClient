import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoitOuvrirEnQuittant } from './site-ouvre-en-quittant';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Site } from 'src/app/modeles/site';
import { SiteService } from 'src/app/modeles/site.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApiResult201Created } from 'src/app/commun/api-results/api-result-201-created';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class ProduitCadreComponent implements OnInit, DoitOuvrirEnQuittant {

    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected service: SiteService,
        protected navigation: NavigationService,
    ) {
    }

    ouvreSite: () => Observable<boolean> = () => {
        const ouvert = this.service.ouvre(this.site).pipe(
            delay(0),
            map(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    return true;
                }
                return false;
            })
        ); // .subscribe(o =>  this.site.ouvert = o);
        return ouvert;
    }

    ngOnInit() {
        this.site = this.navigation.siteEnCours;
    }

}
