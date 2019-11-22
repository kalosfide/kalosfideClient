import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { KeyUidRno } from '../key-uid-rno/key-uid-rno';

export class KeyUidRnoNo implements IKeyUidRnoNo {
    uid: string;
    rno: number;
    no: number;
}

export interface IKeyUidRnoNoData {
    no: number;
}

export interface GroupeUidRnoNo extends KeyUidRno {
    liste: IKeyUidRnoNoData[];
}

export function KeyUidRnoNoCréeParams(key: IKeyUidRnoNo): { [param: string]: string } {
    return {
        'uid': key.uid,
        'rno': '' + key.rno,
        'no': '' + key.no,
    };
}
