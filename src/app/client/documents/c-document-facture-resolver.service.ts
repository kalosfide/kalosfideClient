import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { DocumentService } from '../../documents/document.service';
import { DocumentFacture } from '../../documents/document-facture';

@Injectable()
export class CDocumentFactureResolverService implements Resolve<DocumentFacture> {

    constructor(
        private _router: RouteurService,
        private _service: DocumentService,
    ) {
    }

    get routeur(): RouteurService { return this._router; }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<DocumentFacture> {
        const keyIdentifiant = this._service.keyIdentifiant;
        const no = +route.paramMap.get('no');
        return this._service.facture$({
            uid: keyIdentifiant.uid,
            rno: keyIdentifiant.rno,
            no: no
        });
    }

}
