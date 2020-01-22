import { DataKeyUtile } from '../data-key-utile';
import { KeyUidRnoNo2Service } from './key-uid-rno-no-2.service';
import { KeyUidRnoNo2 } from './key-uid-rno-no-2';

export class KeyUidRnoNo2Utile<T extends KeyUidRnoNo2> extends DataKeyUtile<T> {
    constructor(service: KeyUidRnoNo2Service<T>) {
        super(service);
    }

    get service(): KeyUidRnoNo2Service<T> {
        return this._service.dataService as KeyUidRnoNo2Service<T>;
    }
}
