import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { IKeyUidRnoNoD } from './i-key-uid-rno-no-d';
import { KfInputDate } from '../../kf-composants/kf-elements/kf-input/kf-input-date';

export abstract class KeyUidRnoNoDEditeur<T extends IKeyUidRnoNoD> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;
    protected _kfD: KfInputDate;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfInputTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfInputNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfInputNombre('no');
        this.champsKeys.push(this._kfNo);
        this._kfD = new KfInputDate('date');
        this.champsKeys.push(this._kfD);
    }
    fixeChampsKeys(key: IKeyUidRnoNoD) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
        this._kfNo.fixeValeur(key.no);
    }
}
