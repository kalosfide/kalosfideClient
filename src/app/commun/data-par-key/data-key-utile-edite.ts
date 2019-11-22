import { DataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';

export abstract class DataKeyUtileEdite<T extends DataKey> {
    protected _utile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this._utile = utile;
    }

    abstract champsKey(): KfComposant[];
}
