import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { DocumentService } from '../../documents/document.service';
import { DocumentFacture } from '../../documents/document-facture';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

@Injectable()
export class FDocumentFactureResolverService implements Resolve<DocumentFacture> {

    constructor(
        private _router: RouteurService,
        private _service: DocumentService,
    ) {
    }

    get routeur(): RouteurService { return this._router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<DocumentFacture> {
        return this._service.facture$(KeyUidRnoNo.keyDeTexte(route.paramMap.get('key')));
    }

}
