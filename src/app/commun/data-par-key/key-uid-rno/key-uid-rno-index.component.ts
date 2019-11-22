import { Router, ActivatedRoute } from '@angular/router';

import { IKeyUidRno } from './i-key-uid-rno';
import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyIndexComponent } from '../data-key-index.component';
import { texteKeyUidRno } from '../data-key';

export abstract class KeyUidRnoIndexComponent<T extends IKeyUidRno> extends DataKeyIndexComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected service: KeyUidRnoService<T>,
    ) {
        super(route, service);
    }
}
