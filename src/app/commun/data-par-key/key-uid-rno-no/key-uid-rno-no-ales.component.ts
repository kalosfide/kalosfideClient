import { Router, ActivatedRoute } from '@angular/router';

import { KeyUidRnoNoService } from './key-uid-rno-no.service';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { DataKeyALESComponent } from '../data-key-ales.component';

export abstract class KeyUidRnoNoALESComponent<T extends KeyUidRnoNo> extends DataKeyALESComponent<T>  {

    constructor(
        protected route: ActivatedRoute,
        protected _service: KeyUidRnoNoService<T>,
    ) {
        super(route, _service);
    }
}
