import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DataKeyEditeur } from '../data-key editeur';
import { KeyUidRnoNo2 } from './key-uid-rno-no-2';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';

export abstract class KeyUidRnoNo2Editeur<T extends KeyUidRnoNo2> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;
    protected _kfUid2: KfInputTexte;
    protected _kfRno2: KfInputNombre;
    protected _kfNo2: KfInputNombre;

    créeKfDeKey() {
        this._kfUid = Fabrique.input.texteInvisible('uid');
        this._kfRno = Fabrique.input.nombreInvisible('rno');
        this._kfNo = Fabrique.input.nombreInvisible('no');
        this._kfUid2 = Fabrique.input.texteInvisible('uid2');
        this._kfRno2 = Fabrique.input.nombreInvisible('rno2');
        this._kfNo2 = Fabrique.input.nombreInvisible('no2');
        this.kfDeKey = [
            this._kfUid,
            this._kfRno,
            this._kfNo,
            this._kfUid2,
            this._kfRno2,
            this._kfNo2
        ];
    }
    fixeKfKey(key: IKeyUidRnoNo2) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
        this._kfNo.valeur = key.no;
        this._kfUid2.valeur = key.uid2;
        this._kfRno2.valeur = key.rno2;
        this._kfNo2.valeur = key.no2;
    }
}
