import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtileLien } from './document-utile-lien';
import { DocumentUtile } from './document-utile';
import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';

export class DocumentUtileBouton extends DataUtileBouton {
    constructor(utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this._dataUtile as DocumentUtile;
    }

    get url(): DocumentUtileUrl {
        return this.utile.url;
    }

    get lien(): DocumentUtileLien {
        return this.utile.lien;
    }

}
