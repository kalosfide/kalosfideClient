import { DataKeyService } from './data-key.service';
import { DataUtile } from './data-utile';
import { IDataKey } from './data-key';
import { DataKeyUtileUrl } from './data-key-utile-url';
import { IDataPages } from './data-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { DataKeyUtileLien } from './data-key-utile-lien';
import { DataKeyUtileColonne } from './data-key-utile-colonne';
import { DataKeyUtileOutils } from './data-key-utile-outils';
import { DataKeyUtileEdite } from './data-key-utile-edite';

export class DataKeyUtile<T extends IDataKey> extends DataUtile {
    protected _urlKey: DataKeyUtileUrl<T>;
    protected _lienKey: DataKeyUtileLien<T>;
    protected _colonneKey: DataKeyUtileColonne<T>;
    protected _outilsKey: DataKeyUtileOutils<T>;
    protected _edite: DataKeyUtileEdite<T>;

    dataPages?: IDataPages;
    dataRoutes?: ISiteRoutes;

    constructor(service: DataKeyService<T>) {
        super(service);
    }

    urlSegmentDeKey(t: T): string {
        return this.service.urlSegmentDeKey(t);
    }

    get urlKey(): DataKeyUtileUrl<T> {
        return this._urlKey;
    }

    get lienKey(): DataKeyUtileLien<T> {
        return this._lienKey;
    }

    get colonneKey(): DataKeyUtileColonne<T> {
        return this._colonneKey;
    }

    get outilsKey(): DataKeyUtileOutils<T> {
        return this._outilsKey;
    }

    get edite(): DataKeyUtileEdite<T> {
        return this._edite;
    }

    get service(): DataKeyService<T> {
        return this._service.dataService as DataKeyService<T>;
    }
}
