import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
import { RouteurService } from './routeur.service';

export abstract class DataService {

    public errorMessage: string;

    abstract dataUrl: string;

    abstract http: HttpClient;
    abstract config: ApiConfigService;
    abstract identification: IdentificationService;
    abstract routeur: RouteurService;

    traiteErreur: (error: Response) => boolean;

    constructor(
    ) {
    }

    protected UrlAPI(actionUrl: string, keyUrl?: string) {
        return this.config.route(this.dataUrl, actionUrl, keyUrl);
    }

    protected headers(): HttpHeaders {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return headers;
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
                apiResult = new ApiResult401Unauthorized();
                break;
            case 403:
                apiResult = new ApiResult403Forbidden();
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
            let errMsg = 'Le serveur ne répond pas.';
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
            apiResult = new ApiResultErreur(statusCode, errMsg);
        }
        console.log('apiResult', apiResult);

        return of(apiResult);
    }

    protected post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.post(this.config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        }).pipe(
            tap(res => console.log('create', res, res.headers.keys())),
            map(res => {
                const retour = new ApiResult201Created();
                retour.entity = res.body;
                return retour;
            }
            ))
            .pipe(catchError(this.handleError));
    }

    protected postJson(controller: string, action: string, body?: string, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.http.post(this.config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        }).pipe(
            tap(res => console.log('create', res, res.headers.keys())),
            map(res => {
                const retour = new ApiResult201Created();
                retour.entity = res.body;
                return retour;
            }
            ))
            .pipe(catchError(this.handleError));
    }

    protected get<T>(controller: string, action: string, params: string | { [param: string]: string }): Observable<ApiResult> {
        const observé = (typeof (params) === 'string')
            ? this.http.get<T>(this.config.route(controller, action, params), {
                headers: this.headers(),
                withCredentials: true,
                observe: 'response'
            })
            : this.http.get<T>(this.config.route(controller, action), {
                headers: this.headers(),
                withCredentials: true,
                params: params,
                observe: 'response'
            });
        return observé
            .pipe(tap(res => console.log('read', res)))
            .pipe(map(res => new ApiResult200Ok(res.body)))
            .pipe(catchError(this.handleError));
    }

    protected getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.http.get<T[]>(this.config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        })
            //            .pipe(tap(res => console.log('readAll', res)))
            .pipe(map(res => new ApiResult200Ok<T[]>(res.body)))
            .pipe(catchError(this.handleError));
    }

    protected put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this.http.put(this.config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('update', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    protected delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this.http.delete(this.config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('delete', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    valeurRouteData(routeData: any): any {
        const jsonDeJson = JSON.stringify(routeData);
        const début = jsonDeJson.indexOf('{', jsonDeJson.indexOf('{') + 1);
        const jsonDeValeur = jsonDeJson.slice(début, jsonDeJson.length - 1);
        return JSON.parse(jsonDeValeur);
    }

}
