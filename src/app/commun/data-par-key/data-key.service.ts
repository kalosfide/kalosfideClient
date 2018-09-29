
import { Observable } from 'rxjs';

import { ApiResult } from '../api-results/api-result';
import { DataApiRoutes } from './data-api-routes';
import { DataService } from '../../services/data.service';
import { DataKey, IDataKey } from './data-key';

export abstract class DataKeyService<T> extends DataService {

    abstract apiRouteDeKey: (key?: DataKey) => string;

    abstract litKey(objet: T): DataKey;
    abstract fixeKey(objet: T, key: DataKey);
    abstract créeKey(): Observable<ApiResult>;

    ajoute(objet: T): Observable<ApiResult> {
        return this.create<T>(objet, DataApiRoutes.Api.ajoute);
    }

    lit(key: DataKey): Observable<ApiResult> {
        console.log(key);
        return this.read<T>(this.apiRouteDeKey(key), DataApiRoutes.Api.lit);
    }

    liste(): Observable<ApiResult> {
        return this.read<T>(null, DataApiRoutes.Api.lit);
    }

    abstract listeDuPropriétaire(): Observable<ApiResult>;

    edite(objet: T): Observable<ApiResult> {
        return this.update<T>(objet, DataApiRoutes.Api.edite);
    }

    supprime(objet: T): Observable<ApiResult> {
        return this.update<T>(objet, DataApiRoutes.Api.supprime);
    }

    keyRouteData(routeData: any): DataKey {
        return this.valeurRouteData(routeData) as DataKey;
    }

}
