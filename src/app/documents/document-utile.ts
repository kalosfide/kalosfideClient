import { DocumentService } from './document.service';
import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtileLien } from './document-utile-lien';
import { DocumentUtileColonne } from './document-utile-colonne';
import { DataUtile } from '../commun/data-par-key/data-utile';

export class DocumentUtile extends DataUtile {

    constructor (service: DocumentService) {
        super(service);
        this._url = new DocumentUtileUrl(this);
        this._lien = new DocumentUtileLien(this);
        this._colonne = new DocumentUtileColonne(this);
    }

    get service(): DocumentService {
        return this._service as DocumentService;
    }

    get url(): DocumentUtileUrl {
        return this._url as DocumentUtileUrl;
    }

    get lien(): DocumentUtileLien {
        return this._lien as DocumentUtileLien;
    }

    get colonne(): DocumentUtileColonne {
        return this._colonne as DocumentUtileColonne;
    }
}

