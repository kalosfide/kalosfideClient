import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoNoDService } from './key-uid-rno-no-d.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyUidRnoNoD } from './key-uid-rno-no-d';

export abstract class KeyUidRnoNoDIndexComponent<T extends KeyUidRnoNoD> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoNoDService<T>,
    ) {
        super(route, service);
    }
}
