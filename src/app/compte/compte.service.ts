import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

import { ApiResult } from '../commun/api-results/api-result';
import { ConnectionModel } from './connection/connection.model';
import { tap } from 'rxjs/operators';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { ApiRequêteService } from '../services/api-requete.service';

@Injectable()
export class CompteService extends DataService {

    public controllerUrl = ApiController.utilisateur;

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    public connecte(connectionModel: ConnectionModel): Observable<ApiResult> {
        return this.post(this.controllerUrl, ApiAction.utilisateur.connecte, connectionModel);
    }

    public déconnecte(): Observable<ApiResult> {
        return this.post(this.controllerUrl, ApiAction.utilisateur.deconnecte)
            .pipe(tap(() => {
                this.identification.déconnecte();
            }));
    }

}
