import { ISiteRoutes } from '../../site/site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';

export class FacturePages {
    static clients: PageDef = {
        urlSegment: 'clients',
        title: 'Clients',
        titre: 'Clients à facturer',
        lien: 'Clients à facturer',
    };
    static client: PageDef = {
        urlSegment: 'client',
        title: 'Client',
        titre: 'Commandes à facturer'
    };
    static commandes: PageDef = {
        urlSegment: 'commandes',
        title: 'Commandes',
        titre: ''
    };
    static commande: PageDef = {
        urlSegment: 'commande',
        title: 'Commande',
        titre: ''
    };
    static facture: PageDef = {
        urlSegment: 'facture',
        title: 'Facture',
        titre: 'Enregistrer la facture',
    };
}

class CFactureRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FournisseurPages.factures.urlSegment);
        s = s.concat(segments);
        return FournisseurRoutes.url(nomSite, s);
    }
}
export const FactureRoutes = new CFactureRoutes();
