import { KeyUidRno } from './key-uid-rno/key-uid-rno';
import { KeyUidRnoNo } from './key-uid-rno-no/key-uid-rno-no';
import { KeyUid } from './key-uid/key-uid';
import { IKeyUid } from './key-uid/i-key-uid';
import { IKeyUidRno } from './key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from './key-uid-rno-no/i-key-uid-rno-no';

export type DataKey = KeyUid | KeyUidRno | KeyUidRnoNo;

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
