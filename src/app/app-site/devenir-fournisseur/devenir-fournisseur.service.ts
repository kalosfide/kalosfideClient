import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../commun/api-results/api-result';
import { DevenirFournisseurModel } from './devenir-fournisseur-model';
import { DevenirService } from 'src/app/compte/devenir/devenir.service';
import { ApiAction } from 'src/app/commun/api-route';
import { ApiRequêteService } from 'src/app/services/api-requete.service';

@Injectable()
export class DevenirFournisseurService extends DevenirService {

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    public enregistreFournisseur(data: DevenirFournisseurModel): Observable<ApiResult> {
        return this.post(this.controllerUrl, ApiAction.enregistrement.fournisseur, data);
    }
}
