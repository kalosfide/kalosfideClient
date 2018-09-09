import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../services/app-config.service';

import { BaseService } from '../../services/base.service';

import { IdentificationService } from '../../sécurité/identification.service';
import { Utilisateur } from '../utilisateur';
import { ApiResult } from '../../helpers/api-results/api-result';
import { ConnectionModel } from '../connection/connection.model';
import { Identifiant } from '../../sécurité/identifiant';
import { catchError, map } from 'rxjs/operators';
import { ApiResult204NoContent } from '../../helpers/api-results/api-result-204-no-content';
import { CompteApiRoutes } from '../compte-api-routes';
import { EnregistrementModel } from '../enregistrement/enregistrement-model';

@Injectable()
export class UtilisateurService extends BaseService {

    public dataUrl = 'utilisateur';

    constructor(
        http: HttpClient,
        config: AppConfigService,
        identification: IdentificationService
    ) {
        super(http, config, identification);
    }

    public connecte(connection: ConnectionModel): Observable<ApiResult> {
        console.log('connection', connection);
        const body = connection ? JSON.stringify(connection) : '';
        console.log('body', body);
        return this.http.post<Identifiant>(this.UrlAPI('connecte'), body, this.options())
            .pipe(map(res => {
                console.log(res);
                this.identification.fixeIdentifiant(res);
                return new ApiResult204NoContent();
                }))
            .pipe(catchError(this.handleError));
    }

    public déconnecte() {
        this.identification.déconnecte();
    }

    public enregistre(enregistrementModel: EnregistrementModel): Observable<ApiResult> {
        return this.create<EnregistrementModel>(enregistrementModel, CompteApiRoutes.Api.enregistre);
    }

    public liste(): Observable<ApiResult> {
        return this.readAll<Utilisateur>();
    }

    public lit(id: string): Observable<ApiResult> {
        return this.read<Utilisateur>(id);
    }

    public edite(utilisateur: Utilisateur): Observable<ApiResult> {
        return this.update<Utilisateur>(utilisateur);
    }

    public supprime(utilisateur: Utilisateur): Observable<ApiResult> {
        return this.delete(utilisateur.id);
    }

}
