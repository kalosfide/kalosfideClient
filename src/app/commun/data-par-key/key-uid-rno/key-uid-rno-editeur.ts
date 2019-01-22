import { DataKeyEditeur } from '../data-key-editeur';
import { KfTexte } from '../../kf-composants/kf-elements/kf-input/kf-texte';
import { IKeyUidRno } from './i-key-uid-rno';
import { KfNombre } from '../../kf-composants/kf-elements/kf-input/kf-nombre';

export abstract class KeyUidRnoEditeur<T extends IKeyUidRno> extends DataKeyEditeur<T> {

    protected _kfUid: KfTexte;
    protected _kfRno: KfNombre;


    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfNombre('rno');
        this.champsKeys.push(this._kfRno);
    }
    fixeChampsKeys(key: IKeyUidRno) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
    }
}
