import { Injectable } from '@angular/core';
import { Site, EtatSite } from './site';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { Observable, Subject } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiAction } from '../commun/api-route';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { KeyUidRnoService } from '../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { map, tap, mergeMap } from 'rxjs/operators';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { ApiResult201Created } from '../commun/api-results/api-result-201-created';
import { RouteurService } from '../services/routeur.service';

@Injectable({
    providedIn: 'root'
})
export class SiteService extends KeyUidRnoService<Site> {

    dataUrl = 'site';

    private siteOuvertSubject = new Subject<boolean>();

    constructor(
        private _http: HttpClient,
        private _apiConfig: ApiConfigService,
        private _identification: IdentificationService,
        private _navigation: NavigationService,
        private _routeur: RouteurService
    ) {
        super();
    }

    get http(): HttpClient { return this._http; }
    get config(): ApiConfigService { return this._apiConfig; }
    get identification(): IdentificationService { return this._identification; }
    get navigation(): NavigationService { return this._navigation; }
    get routeur(): RouteurService { return this._routeur; }

    public trouveParNom(nomSite: string): Observable<ApiResult> {
        console.log(nomSite);
        return this.get<Site>(this.dataUrl, ApiAction.site.trouveParNom, nomSite);
    }

    public nomPris(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.site.nomPris, nom).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public nomPrisParAutre(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.site.nomPrisParAutre, nom).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public titrePris(titre: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.site.titrePris, titre).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public titrePrisParAutre(titre: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.site.titrePrisParAutre, titre).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public vérifieEtat(site: Site): Observable<ApiResult> {
        return this.get<EtatSite>(this.dataUrl, ApiAction.site.etat, this.créeParams(site)).pipe(
            tap(apiResult => {
                if (apiResult.statusCode === ApiResult200Ok.code) {
                    const etat = (apiResult as ApiResult200Ok<EtatSite>).lecture;
                    site.etat = etat.etat;
                    site.dateEtat = etat.dateEtat;
                }
            }
            ));
    }

    public ouvert(site: Site): Observable<boolean> {
        return this.vérifieEtat(site).pipe(
            map(apiResult => {
                if (apiResult.statusCode === ApiResult200Ok.code) {
                    return site.ouvert;
                }
            }
            ));
    }

    public ouvre(site: Site): Observable<ApiResult> {
        return this.post<string>(this.dataUrl, ApiAction.site.ouvre, '', this.créeParams(site)).pipe(
            mergeMap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    return this.vérifieEtat(site);
                }
            })
        );
    }

    public ferme(site: Site, jusquA: Date): Observable<ApiResult> {
        console.log('jusquA', jusquA);
        console.log('jusquAJSON', JSON.stringify(jusquA));
        return this.post<Date>(this.dataUrl, ApiAction.site.ferme, jusquA, this.créeParams(site)).pipe(
            tap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    return this.vérifieEtat(site);
                }
            })
        );
    }
}
