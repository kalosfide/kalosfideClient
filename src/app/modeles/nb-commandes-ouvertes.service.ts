import { Injectable } from '@angular/core';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { ApiCommande } from '../commandes/api-commande';
import { ApiRequêteService } from '../services/api-requete.service';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';

@Injectable({
    providedIn: 'root'
})
export class NbCommandesOuvertesService extends KeyUidRnoNoService<ApiCommande> {

    controllerUrl = ApiController.commande;

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    nbOuvertes(key: IKeyUidRno): Observable<number> {
        const apiResult$: Observable<ApiResult> = this.get<number>(this.controllerUrl, ApiAction.commande.nbouvertes, this.créeParams(key));
        return this.objet<number>(apiResult$);
    }

}
