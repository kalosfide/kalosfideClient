import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { DocCLF } from './document';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';

export class DocumentEditeur extends KeyUidRnoEditeur<DocCLF> {
    private _document: DocCLF;

    constructor(document: DocCLF, component: IDataKeyComponent) {
        super(component);
        this._document = document;
    }

    créeKfDeData() {}

}
