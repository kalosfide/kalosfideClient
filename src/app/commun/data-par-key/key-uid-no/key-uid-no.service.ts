
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResult } from '../../api-results/api-result';
import { ApiResult200Ok } from '../../api-results/api-result-200-ok';
import { DataApiRoutes } from '../data-api-routes';
import { IKeyUidNo } from './i-key-uid-no';
import { DataKeyService } from '../data-key.service';
import { DataKey } from '../data-key';
import { KeyUidNo } from './key-uid-no';

export abstract class KeyUidNoService<T extends IKeyUidNo> extends DataKeyService<T> {

    apiRouteDeKey = (dataKey: DataKey): string => {
        const key = dataKey as KeyUidNo;
        if (!key.utilisateurId) {
            key.utilisateurId = this.identification.utilisateurId();
        }
        return key.utilisateurId + '/' + key.no;
    }

    litKey(objet: T) {
        return {
            utilisateurId: objet.utilisateurId,
            no: objet.no
        };
    }
    fixeKey(objet: T, key: DataKey) {
        objet.utilisateurId = (key as KeyUidNo).utilisateurId;
        objet.no = (key as KeyUidNo).no;
    }

    créeKey(): Observable<ApiResult> {
        const utilisateurId = this.identification.utilisateurId();
        return this.read<number>(utilisateurId, DataApiRoutes.Api.dernierNo).pipe(
            map(
                (apiResult: ApiResult) => {
                    let no = 1;
                    if (apiResult.statusCode === ApiResult200Ok.code) {
                        no += (apiResult as ApiResult200Ok<number>).lecture;
                    }
                    return new ApiResult200Ok({ utilisateurId: utilisateurId, no: no });
                }
            )
        );
    }

    listeDuPropriétaire(): Observable<ApiResult> {
        const utilisateurId = this.identification.utilisateurId();
        return this.read<T>(utilisateurId, DataApiRoutes.Api.lit);
    }
}
