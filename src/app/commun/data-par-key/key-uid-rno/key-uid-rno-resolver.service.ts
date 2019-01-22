import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { KeyUidRno } from './key-uid-rno';
import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyResolverService } from '../data-key-resolver.service';

export abstract class KeyUidRnoResolverService<T extends KeyUidRno> extends DataKeyResolverService<T> {
    abstract service: KeyUidRnoService<T>;

    résoudUidRno(route: ActivatedRouteSnapshot): Observable<T> {
        return this.résoudObjet(route, {
            uid: this.service.keyIdentifiant.uid,
            rno: +route.paramMap.get('rno')
        });
    }

}
