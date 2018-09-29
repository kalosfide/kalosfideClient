import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SiteInfo } from './site-info';
import { ApiResult } from '../commun/api-results/api-result';
import { KeyNumberService } from '../commun/data-par-key/key-number/key-number.service';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';

@Injectable()
export class SiteInfoService extends KeyNumberService<SiteInfo> {

    public dataUrl = 'siteinfo';

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

    public get siteInfo(): SiteInfo {
        return {
            id: 0,
            nom: 'kalofide.fr',
            titre: 'Kalosfide',
            date: '2018'
        };
    }

}
