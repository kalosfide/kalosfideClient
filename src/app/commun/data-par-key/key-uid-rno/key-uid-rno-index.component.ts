import { Router, ActivatedRoute } from '@angular/router';

import { IKeyUidRno } from './i-key-uid-rno';
import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { AppRoutes } from 'src/app/app-pages';

export abstract class KeyUidRnoIndexComponent<T extends IKeyUidRno> extends DataKeyIndexComponent<T>  {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: KeyUidRnoService<T>,
    ) {
        super(router, route, service);
    }

    appRouteDeKey = (ligne: IKeyUidRno): string => {
        return ligne.uid + AppRoutes.séparateur + ligne.rno;
    }
}
