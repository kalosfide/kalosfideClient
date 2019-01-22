import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { KeyUidRnoNoD } from './key-uid-rno-no-d';
import { DataKeyResolverService } from '../data-key-resolver.service';

export abstract class KeyUidRnoNoDResolverService<T extends KeyUidRnoNoD> extends DataKeyResolverService<T> {

    _resolve(route: ActivatedRouteSnapshot): Observable<T> {
        return this.objet(this.service.lit({
            uid: this.service.keyIdentifiant.uid,
            rno: this.service.keyIdentifiant.rno,
            no: +route.paramMap.get('no')
        }));
    }

}
