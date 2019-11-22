import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class CommandeEditeNoResolverService implements Resolve<number> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number | Observable<number> {
        return +route.paramMap.get('no');
    }

}
