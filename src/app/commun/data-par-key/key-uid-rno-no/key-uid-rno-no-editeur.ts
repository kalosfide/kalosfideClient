import { DataKeyEditeur } from '../data-key-editeur';
import { KfTexte } from '../../kf-composants/kf-elements/kf-input/kf-texte';
import { KfNombre } from '../../kf-composants/kf-elements/kf-input/kf-nombre';
import { IKeyUidRnoNo } from './i-key-uid-rno-no';

export abstract class KeyUidRnoNoEditeur<T extends IKeyUidRnoNo> extends DataKeyEditeur<T> {

    protected _kfUid: KfTexte;
    protected _kfRno: KfNombre;
    protected _kfNo: KfNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfNombre('no');
        this.champsKeys.push(this._kfNo);
    }
    fixeChampsKeys(key: IKeyUidRnoNo) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
        this._kfNo.fixeValeur(key.no);
    }
}
