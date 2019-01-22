import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoNoService } from './key-uid-rno-no.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { KeyUidRnoNo } from './key-uid-rno-no';

export abstract class KeyUidRnoNoIndexComponent<T extends KeyUidRnoNo> extends DataKeyIndexComponent<T>  {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: KeyUidRnoNoService<T>,
    ) {
        super(router, route, service);
    }
}
