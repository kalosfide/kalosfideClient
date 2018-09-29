import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from './role';
import { KeyUidNoService } from '../../commun/data-par-key/key-uid-no/key-uid-no.service';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { RoleApiRoutes } from './role-api-routes';

@Injectable()
export class RoleService extends KeyUidNoService<Role> {

    public dataUrl = 'role';

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

    fournisseurs(): Observable<ApiResult> {
        return this.readAll<Role>(RoleApiRoutes.Api.fournisseurs);
    }

}
