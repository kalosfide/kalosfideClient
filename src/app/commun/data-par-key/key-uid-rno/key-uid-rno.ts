import { IKeyUidRno } from './i-key-uid-rno';

export class KeyUidRno implements IKeyUidRno {
    uid: string;
    rno: number;

    static aMêmeKey(key1: IKeyUidRno, key2: IKeyUidRno): boolean {
        if (!key1) {
            return !key2;
        }
        if (!key2) {
            return false;
        }
        return key1.uid === key2.uid && key1.rno === key2.rno;
    }
}

export function KeyUidRnoCréeParams(key: IKeyUidRno): { [param: string]: string } {
    return {
        'uid': key.uid,
        'rno': '' + key.rno,
    };
}
