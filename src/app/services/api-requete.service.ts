import { Injectable } from '@angular/core';
import { AttenteService } from './attente.service';
import { RouteurService } from './routeur.service';
import { Observable, of } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { ResultatAction } from '../disposition/affiche-resultat/resultat-affichable';
import { ApiResult400BadRequest } from '../commun/api-results/api-result-400-bad-request';
import { ApiResultErreur } from '../commun/api-results/api-result-erreur';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiResult401Unauthorized } from '../commun/api-results/api-result-401-unauthorized';
import { ApiResult403Forbidden } from '../commun/api-results/api-result-403-forbidden';
import { ApiResult404NotFound } from '../commun/api-results/api-result-404-not-found';
import { ApiResult409Conflict } from '../commun/api-results/api-result-409-conflict';
import { ApiResult204NoContent } from '../commun/api-results/api-result-204-no-content';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { ApiResult201Created } from '../commun/api-results/api-result-201-created';
import { ApiRequêteAction } from './api-requete-action';
import { NavigationService } from './navigation.service';
import { ApiErreur400 } from '../commun/api-results/api-erreur-400';

@Injectable()
export class ApiRequêteService {

    constructor(
        private _http: HttpClient,
        private _config: ApiConfigService,
        private _identification: IdentificationService,
        private _routeur: RouteurService,
        private _navigation: NavigationService,
    ) {
    }

    get identification(): IdentificationService { return this._identification; }
    get routeur(): RouteurService { return this._routeur; }
    get navigation(): NavigationService { return this._navigation; }
    get attenteService(): AttenteService { return this._navigation.attenteService; }

    protected headers(): HttpHeaders {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return headers;
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
                /// IMPORTANT
                this._identification.déconnecte();
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

    public post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this._http.post(this._config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        }).pipe(
            tap(res => console.log('post', res, res.headers.keys())),
            map(res => {
                switch (res.status) {
                    case ApiResult204NoContent.code:
                        return new ApiResult204NoContent();
                    case ApiResult200Ok.code:
                    case ApiResult201Created.code:
                        const retour = new ApiResult201Created();
                        retour.entity = res.body;
                        return retour;
                    default:
                        break;
                }
            }
            ))
            .pipe(catchError(this.handleError));
    }

    public put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        const body = data ? JSON.stringify(data) : '';
        return this._http.put(this._config.route(controller, action), body, {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('put', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    public delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this._http.delete(this._config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        })
            .pipe(tap(res => console.log('delete', res)))
            .pipe(map(() => new ApiResult204NoContent()))
            .pipe(catchError(this.handleError));
    }

    private _get<T>(observé: Observable<HttpResponse<T>>, debug: string): Observable<ApiResult> {
        const attente = this.attenteService.commence(debug);
        return observé.pipe(
            tap(res => console.log('get', res)),
            map(res => new ApiResult200Ok(res.body)),
            catchError(this.handleError)
        ).pipe(
            tap(() => {
                this.attenteService.finit(attente);
            })
        );
    }

    public getSansParamsSansIdentification<T>(controller: string, action: string): Observable<ApiResult> {
        const observé = this._http.get<T>(this._config.route(controller, action), {
                headers: this.headers(),
                observe: 'response'
            });
        return this._get<T>(observé, controller + '/' + action);
    }

    public get<T>(controller: string, action: string, params: string | { [param: string]: string }): Observable<ApiResult> {
        const observé = (typeof (params) === 'string')
            ? this._http.get<T>(this._config.route(controller, action, params), {
                headers: this.headers(),
                withCredentials: true,
                observe: 'response'
            })
            : this._http.get<T>(this._config.route(controller, action), {
                headers: this.headers(),
                withCredentials: true,
                params: params,
                observe: 'response'
            });
        return this._get<T>(observé, controller + '/' + action);
    }

    public getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        const observé = this._http.get<T[]>(this._config.route(controller, action), {
            headers: this.headers(),
            withCredentials: true,
            params: params,
            observe: 'response'
        });
        return this._get<T[]>(observé, controller + '/' + action);
    }

    // Action

    private résultatSuccès(requêteDef: ApiRequêteAction): ResultatAction {
        return ResultatAction.afficheOk(requêteDef.titreSucces ? requêteDef.titreSucces : '');
    }

    private résultatBadRequest(apiErreurs: ApiErreur400[], requêteDef: ApiRequêteAction): ResultatAction {
        let details: string[] = [];
        if (requêteDef.formulaire && apiErreurs) {
            if (requêteDef.formulaire.gereValeur) {
                // place les erreurs dans les validateurs des controles s'il y en a
                const distribution = requêteDef.formulaire.gereValeur.distribueErreurs(apiErreurs);
                details = distribution.messages;
                apiErreurs = distribution.apiErreurs;
            }
            details = details.concat(apiErreurs.map(e => {
                return `Erreur: { champ: ${e.champ}, code: ${e.code}}`;
            }));
        }
        const resultat = ResultatAction.afficheErreur(requêteDef.titreErreur, details);
        return resultat;
    }

    private résultatAutresErreurs(result: ApiResultErreur, requêteDef: ApiRequêteAction): ResultatAction {
        let resultat: ResultatAction;
        if (requêteDef.afficheResultat) {
            resultat = ResultatAction.afficheErreur(requêteDef.titreErreur, [result.message]);
        } else {
            resultat = ResultatAction.redirigeErreur(result);
        }
        return resultat;
    }

    private résultat(requêteDef: ApiRequêteAction): Observable<ResultatAction> {
        return requêteDef.demandeApi().pipe(
            delay(0),
            map((result: ApiResult): ResultatAction => {
                if (!result) {
                    return null;
                }

                switch (result.statusCode) {
                    case 200:
                    case 201:
                    case 204:
                        return this.résultatSuccès(requêteDef);
                    case 400:
                        const apiErreurs = (result as ApiResult400BadRequest).apiErreurs;
                        // les erreurs BadRequest peuvent être redirigées si le contexte a changé
                        if (requêteDef.traiteErreur400) {
                            const traiteur = requêteDef.traiteErreur400().find(
                                r => apiErreurs.find(e => r.code.toLowerCase() === e.code.toLowerCase()) !== undefined);
                            if (traiteur) {
                                const apiResult = new ApiResult(400);
                                apiResult.traite = traiteur.traite;
                                apiResult.traiteObs = traiteur.traiteObs;
                                return ResultatAction.traiteErreur(apiResult);
                            }
                        }
                        // les erreurs BadRequest sont stockées dans les ValidationErrors du formulaire
                        return this.résultatBadRequest(apiErreurs, requêteDef);
                    default:
                        return this.résultatAutresErreurs(result as ApiResultErreur, requêteDef);
                }
            })
        );
    }

    public action(requêteDef: ApiRequêteAction) {
        let noAttente: number;
        const attente = requêteDef.attente
            ? requêteDef.attente
            : {
                commence: () => noAttente = this.attenteService.commence('action'),
                finit: () => this.attenteService.finit(noAttente)
            };

        attente.commence();
        const formGroup = requêteDef.formulaire ? requêteDef.formulaire.formGroup : undefined;
        if (formGroup) {
            if (requêteDef.afficheResultat) {
                requêteDef.afficheResultat.commence();
            }
            //        formGroup.markAsPending();
        }
        const subscription = this.résultat(requêteDef).subscribe(
            resultat => {
                subscription.unsubscribe();
                attente.finit();
                if (resultat.ok) {
                    if (requêteDef.afficheResultat) {
                        requêteDef.afficheResultat.affiche();
                    }
                    requêteDef.actionSiOk();
                } else {
                    if (resultat.apiResultTraite) {
                        if (resultat.apiResultTraite.traite) {
                            resultat.apiResultTraite.traite();
                        }
                        if (resultat.apiResultTraite.traiteObs) {
                            const subscription1 = resultat.apiResultTraite.traiteObs().subscribe(
                                ok => {
                                    subscription1.unsubscribe();
                                }
                            );
                        }
                    }
                    if (resultat.apiResultRedirige) {
                        this._routeur.navigueVersErreur(resultat.apiResultRedirige);
                    }
                    if (requêteDef.afficheResultat) {
                        requêteDef.afficheResultat.affiche(resultat);
                    }
                    if (requêteDef.actionSiErreur) {
                        requêteDef.actionSiErreur(resultat);
                    }
                }
            }
        );
    }

    public actionOkObs(requêteDef: ApiRequêteAction): Observable<boolean> {
        let noAttente: number;
        const attente = requêteDef.attente
            ? requêteDef.attente
            : {
                commence: () => noAttente = this.attenteService.commence('action'),
                finit: () => this.attenteService.finit(noAttente)
            };

        attente.commence();
        const formGroup = requêteDef.formulaire ? requêteDef.formulaire.formGroup : undefined;
        if (formGroup) {
            if (requêteDef.afficheResultat) {
                requêteDef.afficheResultat.commence();
            }
            //        formGroup.markAsPending();
        }
        return this.résultat(requêteDef).pipe(
            map(
            resultat => {
                attente.finit();
                if (resultat.ok) {
                    if (requêteDef.afficheResultat) {
                        requêteDef.afficheResultat.affiche();
                    }
                    requêteDef.actionSiOk();
                    return true;
                } else {
                    if (resultat.apiResultTraite) {
                        resultat.apiResultTraite.traite();
                    }
                    if (resultat.apiResultRedirige) {
                        this._routeur.navigueVersErreur(resultat.apiResultRedirige);
                    }
                    if (requêteDef.afficheResultat) {
                        requêteDef.afficheResultat.affiche(resultat);
                    }
                    if (requêteDef.actionSiErreur) {
                        requêteDef.actionSiErreur(resultat);
                    }
                    return false;
                }
            })
        );
    }

}
