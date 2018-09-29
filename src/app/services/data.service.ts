import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IdentificationService } from '../securite/identification.service';
import { ApiConfigService } from './api-config.service';
import { ApiResult201Created } from '../commun/api-results/api-result-201-created';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { ApiResult204NoContent } from '../commun/api-results/api-result-204-no-content';
import { ApiResult400BadRequest } from '../commun/api-results/api-result-400-bad-request';
import { ApiResult401Unauthorized } from '../commun/api-results/api-result-401-unauthorized';
import { ApiResult404NotFound } from '../commun/api-results/api-result-404-not-found';
import { ApiResult409Conflict } from '../commun/api-results/api-result-409-conflict';
import { ApiResultErreur } from '../commun/api-results/api-result-erreur';
import { ApiResult403Forbidden } from '../commun/api-results/api-result-403-forbidden';
import { AppApiRoutes } from '../app-api-routes';
import { CompteApiRoutes } from '../compte/compte-api-routes';

export abstract class DataService {

    public errorMessage: string;

    abstract dataUrl: string;

    abstract http: HttpClient;
    abstract config: ApiConfigService;
    abstract identification: IdentificationService;

    traiteErreur: (error: Response) => boolean;

    constructor(
    ) {
    }

    protected UrlAPI(actionUrl?: string, keyUrl?: string) {
        let urlApi = this.config.setting['UrlAPI'] + this.dataUrl;
        if (actionUrl) {
            urlApi += '/' + actionUrl;
        }
        if (keyUrl) {
            urlApi += '/' + keyUrl;
        }
        return urlApi;
    }

    protected headers(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const jwt = this.identification.jeton();
        if (jwt) {
            headers = headers.append('Authorization', 'Bearer ' + jwt);
            console.log(jwt);
        }
        console.log(headers);
        return headers;
    }

    protected options() {
        const options = {
            headers: this.headers(),
        };
        return options;
    }

    protected MessageDErreur(error: Response | any): string {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return errMsg;
    }

    protected handleError(error: Response | any) {
        console.log(error);
        let apiResult: ApiResult;
        switch (error.status) {
            case 400:
                apiResult = new ApiResult400BadRequest(error.error);
                break;
            case 401:
                apiResult = new ApiResult401Unauthorized(CompteApiRoutes.Route(CompteApiRoutes.App.connection));
                break;
            case 403:
                apiResult = new ApiResult403Forbidden(AppApiRoutes.Route(AppApiRoutes.App.interdit));
                break;
            case 404:
                apiResult = new ApiResult404NotFound();
                break;
            case 409:
                apiResult = new ApiResult409Conflict();
                break;
            default:
                break;
        }
        if (!apiResult) {

            let statusCode: number;
            let errMsg: string;
            if (error instanceof Response) {
                const body = error.json() || '';
                const err = body || JSON.stringify(body);
                statusCode = error.status;
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
                statusCode = 500;
                errMsg = error.message ? error.message : error.toString();
                errMsg = '500 -' + errMsg;
            }
            apiResult = new ApiResultErreur(statusCode, 'Le serveur ne répond pas.');
        }
        console.log('apiResult', apiResult);

        return throwError(apiResult);
    }

    protected create<T>(data: T, actionUrl?: string): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.post(this.UrlAPI(actionUrl), body, this.options())
            .pipe(tap(res => console.log('create', res)))
            .pipe(map(res => {
                const retour = new ApiResult201Created();
                retour.entity = res.valueOf();
                return retour;
            }
            ))
            .pipe(catchError(this.handleError));
    }

    protected read<T>(keyUrl?: string, actionUrl?: string): Observable<ApiResult> {
        return this.http.get<T>(this.UrlAPI(actionUrl, keyUrl), this.options())
            .pipe(tap(res => console.log('read', res)))
            .pipe(map(res => new ApiResult200Ok(res)))
            .pipe(catchError(this.handleError));
    }

    protected readAll<T>(actionUrl?: string): Observable<ApiResult> {
        return this.http.get<T[]>(this.UrlAPI(actionUrl), this.options())
            .pipe(tap(res => console.log('readAll', res)))
            .pipe(map(res => new ApiResult200Ok<T[]>(res)))
            .pipe(catchError(this.handleError));
    }

    protected update<T>(data: T, actionUrl?: string): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.put(this.UrlAPI(actionUrl), body, this.options())
            .pipe(tap(res => console.log('update', res)))
            .pipe(map(res => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    protected delete(id: string | number, actionUrl?: string): Observable<ApiResult> {
        return this.http.delete(this.UrlAPI(actionUrl) + '/' + id, this.options())
            .pipe(tap(res => console.log('delete', res)))
            .pipe(map(res => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    valeurRouteData(routeData: any): any {
        const jsonDeJson = JSON.stringify(routeData);
        const début = jsonDeJson.indexOf('{', jsonDeJson.indexOf('{') + 1);
        const jsonDeValeur = jsonDeJson.slice(début, jsonDeJson.length - 1);
        return JSON.parse(jsonDeValeur);
    }

}
