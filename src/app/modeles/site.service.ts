import { Injectable } from '@angular/core';
import { Site } from './site';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { Observable, Subject } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiAction } from '../commun/api-route';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { KeyUidRnoService } from '../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { map, tap } from 'rxjs/operators';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { ApiResult201Created } from '../commun/api-results/api-result-201-created';

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
    ) {
        super();
    }

    get http(): HttpClient { return this._http; }
    get config(): ApiConfigService { return this._apiConfig; }
    get identification(): IdentificationService { return this._identification; }
    get navigation(): NavigationService { return this._navigation; }

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

    public ouvert(site: Site): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.site.ouvert, this.créeParams(site)).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public estOuvert$(): Observable<boolean> {
        return this.siteOuvertSubject.asObservable();
    }

    public ouvre(site: Site): Observable<ApiResult> {
        return this.post<string>(this.dataUrl, ApiAction.site.ouvre, '', this.créeParams(site)).pipe(
            tap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    site.etat = 'A';
                    site.dateEtat = new Date();
                    this.siteOuvertSubject.next(true);
                }
            })
        );
    }

    public ferme(site: Site, jusquA: Date): Observable<ApiResult> {
        return this.post<Date>(this.dataUrl, ApiAction.site.ferme, jusquA, this.créeParams(site)).pipe(
            tap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    site.etat = 'I';
                    site.dateEtat = new Date();
                    this.siteOuvertSubject.next(false);
                }
            })
        );
    }
}
