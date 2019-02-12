import { Injectable } from '@angular/core';
import { ApiConfigService } from '../services/api-config.service';
import { IdentificationService } from '../securite/identification.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiAction } from '../commun/api-route';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { Produit } from './produit';
import { map, take } from 'rxjs/operators';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { CategorieService } from './categorie.service';
import { DataKey } from '../commun/data-par-key/data-key';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { RouteurService } from '../services/routeur.service';

@Injectable({
    providedIn: 'root'
})
export class ProduitService extends KeyUidRnoNoService<Produit> {

    dataUrl = 'produit';

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

    disponibles(key: DataKey): Observable<ApiResult> {
        return this.getAll<Produit[]>(this.dataUrl, ApiAction.produit.disponibles, this.créeParams(key));
    }

    nomPris(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.produit.nomPris, nom).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    nomPrisParAutre(nom: string): Observable<boolean> {
        return this.get<boolean>(this.dataUrl, ApiAction.produit.nomPrisParAutre, nom).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    fixePrix(key: KeyUidRno, prix: number): Observable<ApiResult> {
        return this.post(this.dataUrl, ApiAction.produit.fixePrix, prix, this.créeParams(key));
    }
}
