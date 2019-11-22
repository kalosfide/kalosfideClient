import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';
import { DataKey } from '../data-key';

export class KeyUidRnoNo2 implements IKeyUidRnoNo2 {
    uid: string;
    rno: number;
    no: number;
    uid2: string;
    rno2: number;
    no2: number;
}

export function KeyUidRnoNo2CréeParams(key: IKeyUidRnoNo2): { [param: string]: string } {
    return {
        'uid': key.uid,
        'rno': '' + key.rno,
        'no': '' + key.no,
        'uid2': key.uid2,
        'rno2': '' + key.rno2,
        'no2': '' + key.no2,
    };
}
