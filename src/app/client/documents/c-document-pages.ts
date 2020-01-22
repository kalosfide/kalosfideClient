import { DocumentPages } from 'src/app/documents/document-pages';
import { ClientRoutes, ClientPages } from '../client-pages';
import { BaseRoutes } from 'src/app/commun/page-def';
import { ISiteRoutes } from 'src/app/site/site-pages';

export class CDocumentPages extends DocumentPages {}

class CClientDocumentRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments: string[]): string {
        let s: string[] = [];
        s.push(ClientPages.documents.urlSegment);
        s = s.concat(segments);
        return ClientRoutes.url(nomSite, s);
    }
}
export const ClientDocumentRoutes = new CClientDocumentRoutes();

