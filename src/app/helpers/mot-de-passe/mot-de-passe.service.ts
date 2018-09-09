import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

import { KfValidateur, KfValidateurs } from '../kf-composants/kf-partages/kf-validateur';

import { ReglesDeMotDePasse } from './mot-de-passe';
import { AppConfigService } from '../../services/app-config.service';

@Injectable()
export class MotDePasseService {

    constructor(
        private config: AppConfigService,
        private http: HttpClient
    ) {
     }

    régles(): Observable<ReglesDeMotDePasse> {
        const url = this.config.setting['UrlAPI'] + 'motdepasse';
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.get<ReglesDeMotDePasse>(url, options)
            .pipe(take(1));
    }

    règlesParDéfaut(): ReglesDeMotDePasse {
        return {
            noSpaces: true,
            requiredLength: 1,
            requireDigit: false,
            requireLowercase: false,
            requireUppercase: false,
            requireNonAlphanumeric: false,
        };
    }

    ValidateursDeMotDePasse(): Observable<KfValidateur[]> {
        const url = this.config.setting['UrlAPI'] + 'motdepasse';
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.get<ReglesDeMotDePasse>(url, options)
            .pipe(take(1))
            .pipe(map(
                règles => {
                    console.log(règles);
                    const fabrique = KfValidateurs;
                    const validateurs: KfValidateur[] = [];
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
                    return validateurs;
                }
            ));
    }
}
