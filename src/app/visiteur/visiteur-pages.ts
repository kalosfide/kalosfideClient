import { AppPages, AppRoutes } from '../app-pages';
import { ISiteRoutes, SitePages, SiteRoutes } from '../site/site-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class VisiteurPages  {
    static accueil: PageDef = {
        urlSegment: SitePages.accueil.urlSegment,
        lien: '',
        title: 'Accueil',
    };
    static produits: PageDef = {
        urlSegment: 'produits',
        lien: 'Produits',
        title: 'Produits',
    };
    static contact: PageDef = {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    };
    static apropos: PageDef = {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    };
    static devenirClient: PageDef = {
        urlSegment: 'devenirClient',
        lien: 'Devenir client',
        title: 'Devenir client',
        titre: 'Enregistrement d\'un nouveau client',
    };
}

class CVisiteurRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.visiteur.urlSegment, segments);
    }
}
export const VisiteurRoutes = new CVisiteurRoutes();
