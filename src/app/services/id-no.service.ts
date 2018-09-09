import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { AppConfigService } from './app-config.service';
import { IdentificationService } from '../sécurité/identification.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../helpers/api-results/api-result';
import { ApiResult200Ok } from '../helpers/api-results/api-result-200-ok';
import { map } from 'rxjs/operators';
import { IdNoApiRoutes } from './id-no-api-routes';
import { IIdNo } from './i-id-no';

@Injectable()
export abstract class IdNoService<T extends IIdNo> extends BaseService {

    constructor(
        http: HttpClient,
        config: AppConfigService,
        identification: IdentificationService
    ) {
        super(http, config, identification);
    }

    abstract _créeEntité(utilisateurId: string, no: number): T;

    créeEntité(): Observable<ApiResult> {
        const utilisateurId = this.identification.utilisateurId();
        return this.read<number>(utilisateurId, IdNoApiRoutes.Api.dernierNo).pipe(
            map(
                (apiResult: ApiResult) => {
                    let no = 1;
                    if (apiResult.statusCode === ApiResult200Ok.code) {
                        no += (apiResult as ApiResult200Ok<number>).lecture;
                    }
                    return new ApiResult200Ok(this._créeEntité(utilisateurId, no));
                }
            )
        );
    }

    ajoute(idNoObjet: T): Observable<ApiResult> {
        return this.create<T>(idNoObjet, IdNoApiRoutes.Api.ajoute);
    }

    lit(no: number): Observable<ApiResult> {
        const utilisateurId = this.identification.utilisateurId();
        return this.read<T>(utilisateurId + '/' + no, IdNoApiRoutes.Api.lit);
    }

    liste(): Observable<ApiResult> {
        const utilisateurId = this.identification.utilisateurId();
        return this.read<T>(utilisateurId, IdNoApiRoutes.Api.lit);
    }

}
