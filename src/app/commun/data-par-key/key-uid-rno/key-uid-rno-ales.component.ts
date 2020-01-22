import { ActivatedRoute } from '@angular/router';

import { KeyUidRnoService } from './key-uid-rno.service';
import { DataKeyALESComponent } from '../data-key-ales.component';
import { KeyUidRno } from './key-uid-rno';

export abstract class KeyUidRnoALESComponent<T extends KeyUidRno> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected _service: KeyUidRnoService<T>,
    ) {
        super(route, _service);
    }
}
