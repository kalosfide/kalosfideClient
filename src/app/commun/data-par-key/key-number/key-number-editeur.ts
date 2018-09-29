import { DataChamp } from '../data-champ';
import { DataKeyEditeur } from '../data-key-editeur';
import { KfNombre } from '../../kf-composants/kf-elements/kf-nombre/kf-nombre';
import { IKeyNumber } from './i-key-number';

export abstract class KeyNumberEditeur extends DataKeyEditeur {

    protected _kfId: KfNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        let champ: DataChamp;
        this._kfId = new KfNombre('no');
        champ = new DataChamp();
        champ.composant = this._kfId;
        this.champsKeys.push(champ);
    }
    fixeChampsKeys(key: IKeyNumber) {
        this._kfId.fixeValeur(key.id);
    }
}
