import { DocumentService } from './document.service';
import { DocumentUtile } from './document-utile';
import { DataUtileLien } from '../commun/data-par-key/data-utile-lien';
import { DocumentUtileUrl } from './document-utile-url';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { DocumentCommande, DocumentLivraison } from './document-commande';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { DocumentFacture } from './document-facture';
import { IDocument } from './document';

export class DocumentUtileLien extends DataUtileLien {

    constructor (utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this.dataUtile as DocumentUtile;
    }

    get service(): DocumentService {
        return this.utile.service;
    }

    get url(): DocumentUtileUrl {
        return this.utile.url;
    }

    document(document: IDocument): KfLien {
        return Fabrique.lien.lien(this.def('', this.url.document(document), Fabrique.contenu.choisit));
    }

    retourDeDocument(document: IDocument): KfLien {
        return Fabrique.lien.retour(this.url.retourDeDocument(document));
    }
}

