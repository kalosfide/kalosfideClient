import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { IKeyUidRno } from './i-key-uid-rno';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export abstract class KeyUidRnoEditeur<T extends IKeyUidRno> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;


    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  Fabrique.input.texte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = Fabrique.input.nombre('rno');
        this.champsKeys.push(this._kfRno);
    }
    fixeChampsKeys(key: IKeyUidRno) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
    }
}
