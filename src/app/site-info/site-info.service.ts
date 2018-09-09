import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BaseService } from '../services/base.service';
import { AppConfigService } from '../services/app-config.service';
import { IdentificationService } from '../sécurité/identification.service';
import { SiteInfo } from './site-info';
import { ApiResult } from '../helpers/api-results/api-result';

@Injectable()
export class SiteInfoService extends BaseService {

    public dataUrl = 'siteinfo';

    constructor(
        http: HttpClient,
        config: AppConfigService,
        authentication: IdentificationService
    ) {
        super(http, config, authentication);
    }

    public get siteInfo(): SiteInfo {
        return {
            id: 0,
            nom: 'kalofide.fr',
            titre: 'Kalosfide',
            date: '2018'
        };
    }

    public ajoute(siteInfo: SiteInfo): Observable<ApiResult> {
        return this.create<SiteInfo>(siteInfo);
    }

    public liste(): Observable<ApiResult> {
        return this.readAll<SiteInfo>();
    }

    public lit(id: number): Observable<ApiResult> {
        return this.read<SiteInfo>(id);
    }

    public edite(siteInfo: SiteInfo): Observable<ApiResult> {
        return this.update<SiteInfo>(siteInfo);
    }

    public supprime(siteInfo: SiteInfo): Observable<ApiResult> {
        return this.delete(siteInfo.id);
    }

}
