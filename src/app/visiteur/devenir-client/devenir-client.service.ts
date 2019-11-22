import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../commun/api-results/api-result';
import { DevenirClientModel } from './devenir-client-model';
import { DevenirService } from 'src/app/compte/devenir/devenir.service';
import { ApiAction } from 'src/app/commun/api-route';
import { ApiRequêteService } from 'src/app/services/api-requete.service';

@Injectable()
export class DevenirClientService extends DevenirService {

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    public enregistreClient(data: DevenirClientModel): Observable<ApiResult> {
        return this.post(this.controllerUrl, ApiAction.enregistrement.client, data);
    }
}
