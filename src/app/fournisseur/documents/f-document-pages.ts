import { DocumentPages } from 'src/app/documents/document-pages';
import { BaseRoutes, PageDef } from 'src/app/commun/page-def';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';

export class FDocumentPages extends DocumentPages {
    static clients: PageDef = {
        urlSegment: 'clients',
        title: 'Clients',
        titre: 'Clients',
        lien: 'Clients',
    };
    static client: PageDef = {
        urlSegment: 'client',
        title: 'Client',
        titre: 'Client'
    };
}

class CClientDocumentRoutes extends BaseRoutes implements ISiteRoutes {
    texteKey: string;
    documentRoutes: CFournisseurDocumentRoutes;

    constructor(ikeyClient: IKeyUidRno, documentRoutes: CFournisseurDocumentRoutes) {
        super();
        this.texteKey = KeyUidRno.texteDeKey(ikeyClient);
        this.documentRoutes = documentRoutes;
    }
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FDocumentPages.client.urlSegment, this.texteKey);
        s = s.concat(segments);
        return this.documentRoutes.url(nomSite, s);
    }
}

class CFournisseurDocumentRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FournisseurPages.documents.urlSegment);
        s = s.concat(segments);
        return FournisseurRoutes.url(nomSite, s);
    }

    documentRoutes(ikeyClient: IKeyUidRno): CClientDocumentRoutes {
        return new CClientDocumentRoutes(ikeyClient, this);
    }
}
export const FournisseurDocumentRoutes = new CFournisseurDocumentRoutes();
