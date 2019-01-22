import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyUidRnoNoResolverService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-resolver.service';
import { Categorie } from 'src/app/modeles/categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from 'src/app/modeles/categorie.service';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';

@Injectable()
export class CategorieResolverService extends KeyUidRnoNoResolverService<Categorie> implements Resolve<Categorie> {

    constructor(
        private _router: RouteurService,
        private _categorieService: CategorieService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this._router; }
    get service(): KeyUidRnoNoService<Categorie> { return this._categorieService; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Categorie> {
        const site = this.service.navigation.siteEnCours;
        return this.résoudObjet(route, {
            uid: site.uid,
            rno: site.rno,
            no: +route.paramMap.get('no')
        });
    }

}
