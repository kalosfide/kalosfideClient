import { IKeyNumber } from './i-key-number';
import { DataKeyService } from '../data-key.service';
import { KeyNumber } from './key-number';
import { DataKey } from '../data-key';
import { Observable, of } from 'rxjs';
import { ApiResult } from '../../api-results/api-result';
import { ApiResult200Ok } from '../../api-results/api-result-200-ok';

export abstract class KeyNumberService<T extends IKeyNumber> extends DataKeyService<T> {

    apiRouteDeKey = (dataKey: DataKey): string => {
        const key = dataKey as KeyNumber;
        return key.id.toString();
    }

    litKey(objet: T) {
        return {
            id: objet.id
        };
    }
    fixeKey(objet: T, key: DataKey) {
        objet.id = (key as KeyNumber).id;
    }

    créeKey(): Observable<ApiResult> {
        return of(new ApiResult200Ok({ no: 0 }));
    }

    listeDuPropriétaire(): Observable<ApiResult> {
        return this.liste();
    }
}

