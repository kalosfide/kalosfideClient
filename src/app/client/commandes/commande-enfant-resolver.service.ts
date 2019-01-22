import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommandeVue } from './commande';

@Injectable()
export class CommandeEnfantResolverService implements Resolve<CommandeVue> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<CommandeVue> {
        return route.parent.data['commande'];
    }

}
