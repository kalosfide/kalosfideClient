import { KeyUidRnoNo } from './key-uid-rno-no';

export interface IKeyUidRnoNo {
    uid: string;
    rno: number;
    no: number;
}

export function KeyUidRnoNoCréeKey(ikey: IKeyUidRnoNo): KeyUidRnoNo {
    const key = new KeyUidRnoNo();
    key.uid = ikey.uid;
    key.rno = ikey.rno;
    key.no = ikey.no;
    return key;
}
