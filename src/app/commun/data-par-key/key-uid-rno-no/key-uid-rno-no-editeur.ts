import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { IKeyUidRnoNo } from './i-key-uid-rno-no';

export abstract class KeyUidRnoNoEditeur<T extends IKeyUidRnoNo> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfInputTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfInputNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfInputNombre('no');
        this.champsKeys.push(this._kfNo);
    }
    fixeChampsKeys(key: IKeyUidRnoNo) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
        this._kfNo.fixeValeur(key.no);
    }
}
