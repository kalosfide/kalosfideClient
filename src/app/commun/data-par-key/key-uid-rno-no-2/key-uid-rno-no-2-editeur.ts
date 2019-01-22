import { DataKeyEditeur } from '../data-key-editeur';
import { KfTexte } from '../../kf-composants/kf-elements/kf-input/kf-texte';
import { KfNombre } from '../../kf-composants/kf-elements/kf-input/kf-nombre';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';

export abstract class KeyUidRnoNo2Editeur<T extends IKeyUidRnoNo2> extends DataKeyEditeur<T> {

    protected _kfUid: KfTexte;
    protected _kfRno: KfNombre;
    protected _kfNo: KfNombre;
    protected _kfUid2: KfTexte;
    protected _kfRno2: KfNombre;
    protected _kfNo2: KfNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfNombre('no');
        this.champsKeys.push(this._kfNo);
        this._kfUid2 =  new KfTexte('uid2');
        this.champsKeys.push(this._kfUid);
        this._kfRno2 = new KfNombre('rno2');
        this.champsKeys.push(this._kfRno);
        this._kfNo2 = new KfNombre('no2');
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
