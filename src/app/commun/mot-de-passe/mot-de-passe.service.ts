import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { KfValidateur, KfValidateurs } from '../kf-composants/kf-partages/kf-validateur';

import { ReglesDeMotDePasse } from './mot-de-passe';
import { DataService } from '../../services/data.service';
import { ApiResult } from '../api-results/api-result';
import { ApiResult200Ok } from '../api-results/api-result-200-ok';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';

@Injectable()
export class MotDePasseService extends DataService {

    dataUrl = 'motdepasse';

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

    get règlesParDéfaut(): ReglesDeMotDePasse {
        return {
            noSpaces: true,
            requiredLength: 1,
            requireDigit: false,
            requireLowercase: false,
            requireUppercase: false,
            requireNonAlphanumeric: false,
        };
    }

    private AppliqueRègles(règles: ReglesDeMotDePasse, validateurs: KfValidateur[]) {
        const fabrique = KfValidateurs;
        if (règles.noSpaces) {
            validateurs.push(fabrique.noSpaces);
        }
        if (règles.requiredLength) {
            validateurs.push(fabrique.requiredLength(règles.requiredLength));
        }
        if (règles.requireDigit) {
            validateurs.push(fabrique.requireDigit);
        }
        if (règles.requireLowercase) {
            validateurs.push(fabrique.requireLowercase);
        }
        if (règles.requireUppercase) {
            validateurs.push(fabrique.requireUppercase);
        }
        if (règles.requireNonAlphanumeric) {
            validateurs.push(fabrique.requireNonAlphanumeric);
        }
    }

    FixeValidateurs(validateurs: KfValidateur[]): Observable<ApiResult> {
        return this.http.get<ReglesDeMotDePasse>(this.UrlAPI(), this.options())
            .pipe(map(règles => {
                this.AppliqueRègles(règles, validateurs);
                return new ApiResult200Ok(règles);
                }))
            .pipe(catchError(this.handleError));
    }
}
