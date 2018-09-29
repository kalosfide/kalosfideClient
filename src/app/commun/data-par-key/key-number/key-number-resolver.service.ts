import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { KeyNumber } from './key-number';
import { RouteurService } from '../../../services/routeur.service';

export abstract class KeyNumberResolverService implements Resolve<KeyNumber> {
    abstract routeurService: RouteurService;
    abstract router: Router;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<KeyNumber> {
        const ids = route.paramMap.get('id');
        if (!ids) {
            return this.erreur();
        }
        const id = Number.parseInt(ids);
        if (!id) {
            return this.erreur();
        }
        const key: KeyNumber = {
            id: id
        };
        return of(key);
    }

    erreur(): Observable<KeyNumber> {
        this.routeurService.erreurDeRoute = this.router.url;
        this.router.navigate(this.routeurService.routeAppIntrouvable);
        return null;
    }
}
