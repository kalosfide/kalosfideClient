import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { RouteurService } from '../../../services/routeur.service';

import { KeyUidNo } from './key-uid-no';

export abstract class KeyUidNoResolverService implements Resolve<KeyUidNo> {
    abstract routeurService: RouteurService;
    abstract router: Router;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<KeyUidNo> {
        const nos = route.paramMap.get('no');
        if (!nos) {
            return this.erreur();
        }
        const no = Number.parseInt(nos);
        if (!no) {
            return this.erreur();
        }
        const key: KeyUidNo = {
            utilisateurId: '',
            no: no
        };
        return of(key);
    }

    erreur(): Observable<KeyUidNo> {
        this.routeurService.erreurDeRoute = this.router.url;
        this.router.navigate(this.routeurService.routeAppIntrouvable);
        return null;
    }

}
