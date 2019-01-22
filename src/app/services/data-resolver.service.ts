import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ApiResult } from '../commun/api-results/api-result';
import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { RouteurService } from './routeur.service';

export abstract class DataResolverService {
    abstract routeur: RouteurService;

    objet<T>(apiResult$: Observable<ApiResult>): Observable<T> {
        return apiResult$.pipe(
            take(1),
            mergeMap(apiResult => {
                switch (apiResult.statusCode) {
                    case ApiResult200Ok.code:
                        const objet = (apiResult as ApiResult200Ok<T>).lecture;
                        return of(objet);
                    default:
                        this.routeur.navigue(apiResult.routeErreur);
                        return EMPTY;
                }
            })
        );
    }
}
