import { SitePages, ISiteRoutes } from 'src/app/site/site-pages';
import { ClientRoutes } from 'src/app/client/client-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';

export class CommanderPages {
     static accueil: PageDef = {
        urlSegment: 'accueil',
        title: 'Commande',
        titre: 'Commandes',
    };
    static termine: PageDef = {
        urlSegment: 'termine',
        title: 'Termine',
        titre: 'Bon de commande transmis',
    };
}

class CCommandeRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(SitePages.commandes.urlSegment);
        s = s.concat(segments);
        return ClientRoutes.url(nomSite, s);
    }
}
export const CommandeRoutes = new CCommandeRoutes();
