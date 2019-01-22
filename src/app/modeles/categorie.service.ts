import { Injectable } from '@angular/core';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { Observable } from 'rxjs';
import { ApiAction } from '../commun/api-route';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { Categorie } from './categorie';
import { map, take } from 'rxjs/operators';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';

@Injectable({
    providedIn: 'root'
})
export class CategorieService extends KeyUidRnoNoService<Categorie> {

    dataUrl = 'categorie';

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

    nomPris(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.categorie.nomPris, nom).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    nomPrisParAutre(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.categorie.nomPrisParAutre, nom).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }
}
