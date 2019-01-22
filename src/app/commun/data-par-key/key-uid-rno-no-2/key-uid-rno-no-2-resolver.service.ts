import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataKeyResolverService } from '../data-key-resolver.service';
import { KeyUidRnoNo2 } from './key-uid-rno-no-2';

export abstract class KeyUidRnoNo2ResolverService<T extends KeyUidRnoNo2> extends DataKeyResolverService<T> {

    résoudUidRNoNo2(route: ActivatedRouteSnapshot): Observable<T> {
        const key: KeyUidRnoNo2 = {
            uid: this.service.keyIdentifiant.uid,
            rno: this.service.keyIdentifiant.rno,
            no: +route.paramMap.get('no'),
            uid2: route.queryParamMap.get('uid2'),
            rno2: +route.queryParamMap.get('rno2'),
            no2: +route.queryParamMap.get('no2')
        };
        return this.objet(this.service.lit(key));
    }

    résoudUidRNoNo(route: ActivatedRouteSnapshot): Observable<T> {
        return this.résoudObjet(route, {
            uid: this.service.keyIdentifiant.uid,
            rno: this.service.keyIdentifiant.rno,
            no: +route.paramMap.get('no')
        });
    }

    résoudUidRNo(route: ActivatedRouteSnapshot): Observable<T[]> {
        return this.résoudListe(route, {
            uid: this.service.keyIdentifiant.uid,
            rno: this.service.keyIdentifiant.rno,
        });
    }

}
