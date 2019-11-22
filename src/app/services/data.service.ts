import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IdentificationService } from '../securite/identification.service';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { RouteurService } from './routeur.service';
import { ApiRequêteService } from './api-requete.service';
import { ApiRequêteAction } from './api-requete-action';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { NavigationService } from './navigation.service';
import { AttenteService } from './attente.service';

export abstract class DataService {

    abstract controllerUrl: string;

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
    }

    get identification(): IdentificationService { return this._apiRequete.identification; }
    get routeur(): RouteurService { return this._apiRequete.routeur; }
    get navigation(): NavigationService { return this._apiRequete.navigation; }
    get attenteService(): AttenteService { return this._apiRequete.attenteService; }

    public get keyIdentifiant(): KeyUidRno {
        const identifiant = this.identification.litIdentifiant();
        if (identifiant) {
            const nomSite = this.navigation.litSiteEnCours().nomSite;
            return {
                uid: identifiant.uid,
                rno: identifiant.roles.find(r => r.nomSite === nomSite).rno
            };
        }
    }

    public get keySiteEnCours(): KeyUidRno {
        const site = this.navigation.litSiteEnCours();
        const keySite = {
            uid: site.uid,
            rno: site.rno
        };
        return keySite;
    }

    protected post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this._apiRequete.post<T>(controller, action, data, params);
    }

    protected put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this._apiRequete.put<T>(controller, action, data, params);
    }

    protected delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this._apiRequete.delete(controller, action, params);
    }

    protected getSansParamsSansIdentification(controller: string, action: string): Observable<ApiResult> {
        return this._apiRequete.getSansParamsSansIdentification(controller, action);
    }

    protected get<T>(controller: string, action: string, params: string | { [param: string]: string }): Observable<ApiResult> {
        return this._apiRequete.get<T>(controller, action, params);
    }

    protected getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        return this._apiRequete.getAll<T>(controller, action, params);
    }

    public objet<T>(apiResult$: Observable<ApiResult>): Observable<T> {
        return apiResult$.pipe(
            take(1),
            mergeMap(apiResult => {
                switch (apiResult.statusCode) {
                    case ApiResult200Ok.code:
                        const objet = (apiResult as ApiResult200Ok<T>).lecture;
                        return of(objet);
                    default:
                        this.routeur.navigueVersErreur(apiResult);
                        return EMPTY;
                }
            })
        );
    }

    public action(requêteActionDef: ApiRequêteAction) {
        this._apiRequete.action(requêteActionDef);
    }

    public actionOkObs(requêteActionDef: ApiRequêteAction): Observable<boolean> {
        return this._apiRequete.actionOkObs(requêteActionDef);
    }

}
