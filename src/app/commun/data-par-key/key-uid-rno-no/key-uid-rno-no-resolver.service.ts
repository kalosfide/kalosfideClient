import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { KeyUidRnoNo } from './key-uid-rno-no';
import { DataKeyResolverService } from '../data-key-resolver.service';
import { KeyUidRno } from '../key-uid-rno/key-uid-rno';

export abstract class KeyUidRnoNoResolverService<T extends KeyUidRnoNo> extends DataKeyResolverService<T> {

    résoudNo(route: ActivatedRouteSnapshot, key: KeyUidRno): Observable<T> {
        return this.résoudObjet(route, {
            uid: key.uid,
            rno: key.rno,
            no: +route.paramMap.get('no')
        });
    }

}
