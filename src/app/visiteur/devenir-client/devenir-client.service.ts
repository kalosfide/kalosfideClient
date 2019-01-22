import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../commun/api-results/api-result';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';
import { DevenirClientModel } from './devenir-client-model';
import { DevenirService } from 'src/app/compte/devenir/devenir.service';

@Injectable()
export class DevenirClientService extends DevenirService {

    constructor(
        private _http: HttpClient,
        private _apiConfig: ApiConfigService,
        private _identification: IdentificationService,
    ) {
        super();
    }

    get http(): HttpClient { return this._http; }
    get config(): ApiConfigService { return this._apiConfig; }
    get identification(): IdentificationService { return this._identification; }

    public enregistreClient(data: DevenirClientModel): Observable<ApiResult> {
        return this.post(this.dataUrl, 'client', data);
    }
}
