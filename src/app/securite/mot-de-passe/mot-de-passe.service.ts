import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { KfValidateur, KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { DataService } from 'src/app/services/data.service';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { IdentificationService } from '../identification.service';
import { ReglesDeMotDePasse } from './mot-de-passe';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ApiResult200Ok } from 'src/app/commun/api-results/api-result-200-ok';

@Injectable()
export class MotDePasseService extends DataService {

    dataUrl = ApiController.motdepasse;

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

    chargeRègles(): Observable<ApiResult> {
        return this.http.get<ReglesDeMotDePasse>(this.UrlAPI(ApiAction.motdepasse.options), { headers: this.headers() })
            .pipe(map(règles => {
                return new ApiResult200Ok(règles);
            }))
            .pipe(catchError(this.handleError));
    }
}
