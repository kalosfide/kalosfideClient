
import { Observable } from 'rxjs';

import { ApiResult } from '../api-results/api-result';
import { DataService } from '../../services/data.service';
import { DataKey } from './data-key';
import { ApiAction } from '../api-route';
import { NavigationService } from 'src/app/services/navigation.service';
import { KeyUidRno } from './key-uid-rno/key-uid-rno';

export abstract class DataKeyService<TObjet extends DataKey> extends DataService {

    abstract navigation: NavigationService;

    protected créeParams(key: any): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        if (key.uid) { params['uid'] = key.uid; }
        if (key.rno) { params['rno'] = key.rno; }
        if (key.no) { params['no'] = key.no; }
        if (key.date) { params['date'] = key.date; }
        if (key.uid2) { params['uid2'] = key.uid2; }
        if (key.rno2) { params['rno2'] = key.rno2; }
        if (key.no2) { params['no2'] = key.no2; }
        return params;
    }

    public get keyIdentifiant(): KeyUidRno {
        const identifiant = this.identification.litIdentifiant();
        if (identifiant) {
            const key = new KeyUidRno();
            const nomSite = this.navigation.siteEnCours.nomSite;
            return {
                uid: identifiant.uid,
                rno: identifiant.roles.find(r => r.nomSite === nomSite).rno
            };
        }
    }

    abstract get keyDeAjoute(): DataKey;

    ajoute(objet: TObjet): Observable<ApiResult> {
        return this.post<TObjet>(this.dataUrl, ApiAction.data.ajoute, objet);
    }

    lit(key: DataKey): Observable<ApiResult> {
        console.log(key);
        return this.get<TObjet>(this.dataUrl, ApiAction.data.lit, this.créeParams(key));
    }

    liste(key?: DataKey): Observable<ApiResult> {
        return key
            ? this.getAll<TObjet>(this.dataUrl, ApiAction.data.liste, this.créeParams(key))
            : this.getAll<TObjet>(this.dataUrl, ApiAction.data.liste);
    }

    edite(objet: TObjet): Observable<ApiResult> {
        return this.put<TObjet>(this.dataUrl, ApiAction.data.edite, objet);
    }

    supprime(key: DataKey): Observable<ApiResult> {
        return this.delete(this.dataUrl, ApiAction.data.supprime, this.créeParams(key));
    }

}
