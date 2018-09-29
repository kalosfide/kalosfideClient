import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { RouteurService } from '../../services/routeur.service';
import { DataKeyService } from './data-key.service';
import { ApiResult } from '../api-results/api-result';

export abstract class DataKeyResolverService<T> {
    abstract service: DataKeyService<T>;
    abstract routeurService: RouteurService;
    abstract router: Router;

    abstract resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResult>;
}
