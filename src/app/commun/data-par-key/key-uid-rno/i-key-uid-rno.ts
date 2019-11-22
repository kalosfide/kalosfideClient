import { DataKey } from '../data-key';
import { KeyUidRno } from './key-uid-rno';

export interface IKeyUidRno {
    uid: string;
    rno: number;
}

export function KeyUidRnoCréeKey(ikey: IKeyUidRno): KeyUidRno {
    const key = new KeyUidRno();
    key.uid = ikey.uid;
    key.rno = ikey.rno;
    return key;
}
