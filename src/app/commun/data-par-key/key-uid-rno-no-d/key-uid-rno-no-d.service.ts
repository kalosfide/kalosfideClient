

import { DataKeyService } from '../data-key.service';
import {  IKeyUidRnoNoD } from './i-key-uid-rno-no-d';
import { DataKey } from '../data-key';
import { KeyUidRnoNoD } from './key-uid-rno-no-d';

export abstract class KeyUidRnoNoDService<T extends IKeyUidRnoNoD> extends DataKeyService<T> {

    get keyDeAjoute(): DataKey {
        const key = new KeyUidRnoNoD();
        const enCours = this.keyIdentifiant;
        key.uid = enCours.uid;
        key.rno = enCours.rno;
        key.no = -1;
        return key;
    }

    créeParams(objet: DataKey): { [param: string]: string } {
        const key = objet as IKeyUidRnoNoD;
        return key.no ? {
            'uid': key.uid,
            'rno': '' + key.rno,
            'no': '' + key.no,
        } : key.rno ? {
            'uid': key.uid,
            'rno': '' + key.rno,
        } : {
            'uid': key.uid,
        };
    }
}
