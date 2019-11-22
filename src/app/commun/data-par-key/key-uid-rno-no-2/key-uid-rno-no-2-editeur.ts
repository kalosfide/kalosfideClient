import { DataKeyEditeur } from '../data-key-editeur';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export abstract class KeyUidRnoNo2Editeur<T extends IKeyUidRnoNo2> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;
    protected _kfUid2: KfInputTexte;
    protected _kfRno2: KfInputNombre;
    protected _kfNo2: KfInputNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        this._kfUid =  Fabrique.input.texte('uid');
        this.champsKeys.push(this._kfUid);
        this._kfRno = Fabrique.input.nombre('rno');
        this.champsKeys.push(this._kfRno);
        this._kfNo = Fabrique.input.nombre('no');
        this.champsKeys.push(this._kfNo);
        this._kfUid2 =  Fabrique.input.texte('uid2');
        this.champsKeys.push(this._kfUid);
        this._kfRno2 = Fabrique.input.nombre('rno2');
        this.champsKeys.push(this._kfRno);
        this._kfNo2 = Fabrique.input.nombre('no2');
        this.champsKeys.push(this._kfNo2);
    }
    fixeChampsKeys(key: IKeyUidRnoNo2) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
        this._kfNo.valeur = key.no;
        this._kfUid2.valeur = key.uid2;
        this._kfRno2.valeur = key.rno2;
        this._kfNo2.valeur = key.no2;
    }
}
