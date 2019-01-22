import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

import { ApiResult } from '../commun/api-results/api-result';
import { ConnectionModel } from './connection/connection.model';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { ApiController, ApiAction } from 'src/app/commun/api-route';

@Injectable()
export class CompteService extends DataService {

    public dataUrl = ApiController.utilisateur;

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

    public connecte(connectionModel: ConnectionModel): Observable<ApiResult> {
        return this.post(this.dataUrl, ApiAction.utilisateur.connecte, connectionModel);
    }

    public déconnecte(): Observable<ApiResult> {
        return this.post(this.dataUrl, ApiAction.utilisateur.deconnecte)
            .pipe(tap(() => {
                this.identification.déconnecte();
            }));
    }

}
