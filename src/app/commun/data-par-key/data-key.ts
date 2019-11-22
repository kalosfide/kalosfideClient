import { KeyUidRno } from './key-uid-rno/key-uid-rno';
import { KeyUidRnoNo } from './key-uid-rno-no/key-uid-rno-no';
import { KeyUid } from './key-uid/key-uid';
import { IKeyUid } from './key-uid/i-key-uid';
import { IKeyUidRno } from './key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from './key-uid-rno-no/i-key-uid-rno-no';
import { IKeyUidRnoNo2 } from './key-uid-rno-no-2/i-key-uid-rno-no-2';

export type DataKey = KeyUid | KeyUidRno | KeyUidRnoNo | IKeyUidRnoNo;

export interface IDataKey {
    uid?: string;
    rno?: number;
    no?: number;
}

export function copieKeyUid(de: IKeyUid, vers: IKeyUid) {
    vers.uid = de.uid;
}

export function copieKeyUidRno(de: IKeyUidRno, vers: IKeyUidRno) {
    copieKeyUid(de, vers);
    vers.rno = de.rno;
}

export function copieKeyUidRnoNo(de: IKeyUidRnoNo, vers: IKeyUidRnoNo) {
    copieKeyUidRno(de, vers);
    vers.no = de.no;
}

export function copieKeyUidRnoNo2(de: IKeyUidRnoNo2, vers: IKeyUidRnoNo2) {
    copieKeyUidRnoNo(de, vers);
    vers.uid2 = de.uid2;
    vers.rno2 = de.rno2;
    vers.no2 = de.no2;
}

export function texteKeyUid(key: IKeyUid): string {
    return key.uid;
}

export function texteKeyUidRno(key: IKeyUidRno): string {
    return key.uid + '-' + key.rno;
}

export function texteKeyUidRnoNo(key: IKeyUidRnoNo): string {
    return key.uid + '-' + key.rno + '-' + key.no;
}

export function texteKeyUidRnoNo2(key: IKeyUidRnoNo2): string {
    return key.uid + '-' + key.rno + '-' + key.no + '-' + key.uid2 + '-' + key.rno2 + '-' + key.no2;
}

export function keyDeTexteUid(texte: string): KeyUid {
    const segments: string[] = texte.split('-');
    try {
        return {
            uid: segments[0],
        };
    } catch (error) {
    }
}

export function keyDeTexteUidRno(texte: string): KeyUidRno {
    const segments: string[] = texte.split('-');
    try {
        return {
            uid: segments[0],
            rno: Number.parseInt(segments[1], 10),
        };
    } catch (error) {
    }
}

export function compareKeyUid(key1: IKeyUid, key2: IKeyUid): boolean {
    return key1.uid === key2.uid;
}

export function compareKeyUidRno(key1: IKeyUidRno, key2: IKeyUidRno): boolean {
    return compareKeyUid(key1, key2) && key1.rno === key2.rno;
}

export function compareKeyUidRnoNo(key1: IKeyUidRnoNo, key2: IKeyUidRnoNo): boolean {
    return compareKeyUidRno(key1, key2) && key1.no === key2.no;
}

export function compareKeyUidRnoNo2(key1: IKeyUidRnoNo2, key2: IKeyUidRnoNo2): boolean {
    return compareKeyUidRnoNo(key1, key2) && key1.no2 === key2.no2;
}
