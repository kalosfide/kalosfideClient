import { SiteRoutes, SitePages, ISiteRoutes } from '../site/site-pages';
import { AppRoutes } from '../app-pages';

export const ClientPages = {
    accueil: {
        urlSegment: SitePages.accueil.urlSegment,
        lien: '',
        title: 'Accueil',
    },
    produits: {
        urlSegment:  'produits',
        lien: 'Produits',
        title: 'Produits',
    },
    commandes: {
        urlSegment: 'commandes',
        lien: 'Commandes',
        title: 'Commandes',
    },
    documents: {
        urlSegment: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    },
    contact: {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    },
};

class CClientRoutes implements ISiteRoutes {
    url(nomSite: string, segments: string[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.client.urlSegment, segments);
    }
}
export const ClientRoutes = new CClientRoutes();
