import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { IKeyUidRno } from './i-key-uid-rno';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';

export abstract class KeyUidRnoEditeur<T extends IKeyUidRno> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;


    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  new KfInputTexte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = new KfInputNombre('rno');
        this.champsKeys.push(this._kfRno);
    }
    fixeChampsKeys(key: IKeyUidRno) {
        this._kfUid.fixeValeur(key.uid);
        this._kfRno.fixeValeur(key.rno);
    }
}
