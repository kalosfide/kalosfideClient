import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../services/api-config.service';
import { IdentificationService } from '../../securite/identification.service';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../../services/navigation.service';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Commande } from './commande';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { CommandeLigne } from './commande-ligne';
import { ApiAction } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Autorisation } from 'src/app/securite/autorisation';
import { CommandeVue } from '../livraisons/suivi-commande';

@Injectable({
    providedIn: 'root'
})
export class CommandeService extends KeyUidRnoNoService<Commande> {

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

    derniereCommande(): Observable<ApiResult> {
        const identifiant = this.identification.litIdentifiant();
        const site = this._navigation.siteEnCours;
        const roleClient = identifiant.roleClient(site);
        const key: KeyUidRno = {
            uid: identifiant.uid,
            rno: roleClient.rno
        };
        return this.get<CommandeVue>(this.dataUrl, ApiAction.commande.precedente, this.créeParams(key));
    }

    envoieBon(no: number, lignes: CommandeLigne[]): Observable<ApiResult> {
        const commande = new Commande();
        const site = this._navigation.siteEnCours;
        const identifiant = this._identification.litIdentifiant();
        commande.uid = identifiant.uid;
        commande.rno = identifiant.roles.find(r => r.nomSite === site.nomSite).rno;
        commande.no = no;
        commande.date = new Date(Date.now());
        commande.details = lignes.map(l => l.créeDetail());
        return this.post<Commande>(this.dataUrl, ApiAction.commande.envoiBon, commande);
    }

}
