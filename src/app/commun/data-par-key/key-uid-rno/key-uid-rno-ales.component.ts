import { Router, ActivatedRoute } from '@angular/router';

import { IKeyUidRno } from './i-key-uid-rno';
import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyALESComponent } from '../data-key-ales.component';

export abstract class KeyUidRnoALESComponent<T extends IKeyUidRno> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected _service: KeyUidRnoService<T>,
    ) {
        super(route, _service);
    }
}
