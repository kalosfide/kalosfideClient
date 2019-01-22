

import { DataKeyService } from '../data-key.service';
import { KeyUidRno } from './key-uid-rno';
import { DataKey } from '../data-key';
import { IKeyUidRno } from './i-key-uid-rno';

export abstract class KeyUidRnoService<T extends IKeyUidRno> extends DataKeyService<T> {

    get keyDeAjoute(): DataKey {
        const key = new KeyUidRno();
        const enCours = this.keyIdentifiant;
        key.uid = enCours.uid;
        key.rno = -1;
        return key;
    }

    créeParams(objet: DataKey): { [param: string]: string } {
        const key = objet as IKeyUidRno;
        return key.rno ? {
            'uid': key.uid,
            'rno': '' + key.rno,
        } : {
            'uid': key.uid,
        };
    }
}
