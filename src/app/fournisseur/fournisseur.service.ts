import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { Fournisseur } from './fournisseur';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiAction } from '../commun/api-route';
import { NavigationService } from '../services/navigation.service';
import { KeyUidRnoService } from '../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { RouteurService } from '../services/routeur.service';

@Injectable()
export class FournisseurService extends KeyUidRnoService<Fournisseur> {

    public dataUrl = 'fournisseur';

    constructor(
        private _http: HttpClient,
        private _apiConfig: ApiConfigService,
        private _identification: IdentificationService,
        private _navigation: NavigationService,
        private _routeur: RouteurService
    ) {
        super();
    }

    get http(): HttpClient { return this._http; }
    get config(): ApiConfigService { return this._apiConfig; }
    get identification(): IdentificationService { return this._identification; }
    get navigation(): NavigationService { return this._navigation; }
    get routeur(): RouteurService { return this._routeur; }

    trouveParSite(nomSite: string): Observable<ApiResult> {
        console.log(nomSite);
        return this.get<Fournisseur>(this.dataUrl, ApiAction.fournisseur.trouveParSite, nomSite);
    }
}
