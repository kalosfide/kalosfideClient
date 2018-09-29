import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

import { Utilisateur } from '../utilisateur';
import { ApiResult } from '../../commun/api-results/api-result';
import { ConnectionModel } from '../connection/connection.model';
import { Identifiant } from '../../securite/identifiant';
import { catchError, map } from 'rxjs/operators';
import { ApiResult204NoContent } from '../../commun/api-results/api-result-204-no-content';
import { CompteApiRoutes } from '../compte-api-routes';
import { EnregistrementModel } from '../enregistrement/enregistrement-model';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';

@Injectable()
export class UtilisateurService extends DataService {

    public dataUrl = 'utilisateur';

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

    public connecte(connection: ConnectionModel): Observable<ApiResult> {
        console.log('connection', connection);
        const body = connection ? JSON.stringify(connection) : '';
        console.log('body', body);
        return this.http.post<Identifiant>(this.UrlAPI(CompteApiRoutes.Api.connecte), body, this.options())
            .pipe(map(res => {
                console.log(res);
                this.identification.fixeIdentifiant(res);
                return new ApiResult204NoContent();
            }))
            .pipe(catchError(this.handleError));
    }

    public déconnecte(): Observable<ApiResult> {
        const body = '';
        this.identification.déconnecte();
        return this.http.post<Identifiant>(this.UrlAPI(CompteApiRoutes.Api.deconnecte), body, this.options())
            .pipe(map(res => {
                console.log('déconnection');
                console.log(res);
                return new ApiResult204NoContent();
            }))
            .pipe(catchError(this.handleError));
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
