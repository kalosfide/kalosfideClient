import { SiteRoutes, SitePages, ISiteRoutes } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class ClientPages  {
    static accueil: PageDef = SitePages.accueil;
    static produits: PageDef = SitePages.produits;
    static commandes: PageDef = SitePages.commandes;
    static documents: PageDef = {
        urlSegment: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    };
    static contact: PageDef = {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };

    static pageDefs: PageDef[] = [
        ClientPages.accueil,
        ClientPages.produits,
        ClientPages.commandes,
        ClientPages.documents,
        ClientPages.contact,
    ];
}

class CClientRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments: string[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.client.urlSegment, segments);
    }
}
export const ClientRoutes = new CClientRoutes();
