import { AppPages, AppRoutes } from '../app-pages';
import { ISiteRoutes, SitePages, SiteRoutes } from '../site/site-pages';

export const VisiteurPages = {
    accueil: {
        urlSegment: SitePages.accueil.urlSegment,
        lien: '',
        title: 'Accueil',
    },
    produits: {
        urlSegment: 'produits',
        lien: 'Produits',
        title: 'Produits',
    },
    contact: {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    },
    apropos: {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    },
    devenirClient: {
        urlSegment: 'devenirClient',
        lien: 'Devenir client',
        title: 'Devenir client',
        titre: 'Enregistrement d\'un nouveau client',
    },
};

class CVisiteurRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.visiteur.urlSegment, segments);
    }
}
export const VisiteurRoutes = new CVisiteurRoutes();
