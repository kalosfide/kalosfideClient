import { Injectable } from '@angular/core';
import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { ProduitPrix } from '../../modeles/produit-prix';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { HttpClient } from '@angular/common/http';
import { RouteurService } from 'src/app/services/routeur.service';

@Injectable({
    providedIn: 'root'
})
export class ProduitPrixService extends KeyUidRnoNoService<ProduitPrix> {

    dataUrl = 'fixeprix';

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
}
