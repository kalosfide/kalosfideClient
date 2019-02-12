import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';

export abstract class KeyUidRnoNo2Editeur<T extends IKeyUidRnoNo2> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;
    protected _kfUid2: KfInputTexte;
    protected _kfRno2: KfInputNombre;
    protected _kfNo2: KfInputNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfInputTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfInputNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfInputNombre('no');
        this.champsKeys.push(this._kfNo);
        this._kfUid2 =  new KfInputTexte('uid2');
        this.champsKeys.push(this._kfUid);
        this._kfRno2 = new KfInputNombre('rno2');
        this.champsKeys.push(this._kfRno);
        this._kfNo2 = new KfInputNombre('no2');
        this.champsKeys.push(this._kfNo2);
    }
    fixeChampsKeys(key: IKeyUidRnoNo2) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
        this._kfNo.fixeValeur(key.no);
        this._kfUid2.fixeValeur(key.uid2);
        this._kfRno2.fixeValeur(key.rno2);
        this._kfNo2.fixeValeur(key.no2);
    }
}
