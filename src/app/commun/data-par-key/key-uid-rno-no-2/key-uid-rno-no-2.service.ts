

import { DataKeyService } from '../data-key.service';
import { DataKey } from '../data-key';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';
import { KeyUidRnoNo2 } from './key-uid-rno-no-2';
import { KeyUidRnoNo } from '../key-uid-rno-no/key-uid-rno-no';

export abstract class KeyUidRnoNo2Service<T extends IKeyUidRnoNo2> extends DataKeyService<T> {

    get keyDeAjoute(): DataKey {
        const key = new KeyUidRnoNo2();
        const enCours = this.keyIdentifiant;
        key.uid = enCours.uid;
        key.rno = enCours.rno;
        key.no = -1;
        return key;
    }

    fixeKeyDeAjoute(envoyé: T, reçu: T) {
        envoyé.no = reçu.no;
    }

    créeParams(objet: DataKey): { [param: string]: string } {
        const key = objet as IKeyUidRnoNo2;
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

    créeParams2(objet: DataKey): { [param: string]: string } {
        const key = objet as IKeyUidRnoNo2;
        return {
            'uid': key.uid2,
            'rno': '' + key.rno2,
        };
    }

    listeU1R1N1(keyUidRnoNo: KeyUidRnoNo) {
        return this.liste(keyUidRnoNo);
    }
}
