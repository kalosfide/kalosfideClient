import { DataKeyEditeur } from '../data-key-editeur';
import { KfTexte } from '../../kf-composants/kf-elements/kf-input/kf-texte';
import { KfNombre } from '../../kf-composants/kf-elements/kf-input/kf-nombre';
import { IKeyUidRnoNoD } from './i-key-uid-rno-no-d';
import { KfDate } from '../../kf-composants/kf-elements/kf-input/kf-date';

export abstract class KeyUidRnoNoDEditeur<T extends IKeyUidRnoNoD> extends DataKeyEditeur<T> {

    protected _kfUid: KfTexte;
    protected _kfRno: KfNombre;
    protected _kfNo: KfNombre;
    protected _kfD: KfDate;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfNombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = new KfNombre('no');
        this.champsKeys.push(this._kfNo);
        this._kfD = new KfDate('date');
        this.champsKeys.push(this._kfD);
    }
    fixeChampsKeys(key: IKeyUidRnoNoD) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
        this._kfNo.fixeValeur(key.no);
    }
}
