import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../commun/api-results/api-result';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';
import { DevenirFournisseurModel } from './devenir-fournisseur-model';
import { DevenirService } from 'src/app/compte/devenir/devenir.service';
import { RouteurService } from 'src/app/services/routeur.service';

@Injectable()
export class DevenirFournisseurService extends DevenirService {

    constructor(
        private _http: HttpClient,
        private _apiConfig: ApiConfigService,
        private _identification: IdentificationService,
        private _routeur: RouteurService
    ) {
        super();
    }

    get http(): HttpClient { return this._http; }
    get config(): ApiConfigService { return this._apiConfig; }
    get identification(): IdentificationService { return this._identification; }
    get routeur(): RouteurService { return this._routeur; }

    public enregistreFournisseur(data: DevenirFournisseurModel): Observable<ApiResult> {
        return this.post(this.dataUrl, 'fournisseur', data);
    }
}
