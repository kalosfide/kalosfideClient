import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../../services/navigation.service';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { FCommandeLigne, FCommandeDetail } from './f-commande';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ApiAction } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

@Injectable({
    providedIn: 'root'
})
export class FCommandeService extends KeyUidRnoNoService<FCommandeLigne> {

    dataUrl = 'commande';

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

    ouvertes(key: KeyUidRno) {
        return this.getAll<FCommandeDetail>(this.dataUrl, ApiAction.commande.ouvertes, this.créeParams(key));
    }

    accepte(key: KeyUidRno, details: FCommandeDetail[]): Observable<ApiResult> {
        return this.post<FCommandeDetail[]>(this.dataUrl, ApiAction.commande.accepte, details, this.créeParams(key));
    }

}
