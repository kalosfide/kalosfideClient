import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export abstract class KeyUidRnoNoEditeur<T extends IKeyUidRnoNo> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  Fabrique.input.texte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = Fabrique.input.nombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = Fabrique.input.nombre('no');
        this.champsKeys.push(this._kfNo);
    }
    fixeChampsKeys(key: IKeyUidRnoNo) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
        this._kfNo.valeur = key.no;
    }
}
