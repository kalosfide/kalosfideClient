import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { Documents } from './documents';
import { DocumentService } from './document.service';

/**
 * résoud la liste des documents du site en cours
 */
@Injectable()
export class DocumentsResolverService implements Resolve<Documents> {

    constructor(
        private _router: RouteurService,
        private _service: DocumentService,
    ) {
    }

    get routeur(): RouteurService { return this._router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Documents> {
        return this._service.documents$();
    }

}
