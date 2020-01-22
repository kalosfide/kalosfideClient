import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { DocumentService } from '../../documents/document.service';
import { DocumentCommande } from '../../documents/document-commande';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';

/**
 * résoud la liste des documents du site en cours
 */
@Injectable()
export class FDocumentCommandeResolverService implements Resolve<DocumentCommande> {

    constructor(
        private _router: RouteurService,
        private _service: DocumentService,
    ) {
    }

    get routeur(): RouteurService { return this._router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<DocumentCommande> {
        return this._service.commande$(KeyUidRnoNo.keyDeTexte(route.paramMap.get('key')));
    }

}
