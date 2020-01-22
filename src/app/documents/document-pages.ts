import { PageDef, BaseRoutes } from 'src/app/commun/page-def';
import { ISiteRoutes } from '../site/site-pages';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur/fournisseur-pages';

export class DocumentPages {
    static liste: PageDef = {
        urlSegment: 'liste',
        title: 'liste',
        titre: ''
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
    static livraisons: PageDef = {
        urlSegment: 'livraisons',
        title: 'Livraisons',
        titre: 'Livraisons',
    };
    static livraison: PageDef = {
        urlSegment: 'livraison',
        title: 'Livraison',
        titre: 'Livraison',
    };
    static factures: PageDef = {
        urlSegment: 'factures',
        title: 'Factures',
        titre: 'Factures',
    };
    static facture: PageDef = {
        urlSegment: 'facture',
        title: 'Facture',
        titre: 'Facture',
    };
}

class CDocumentRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FournisseurPages.documents.urlSegment);
        s = s.concat(segments);
        return FournisseurRoutes.url(nomSite, s);
    }
}
export const DocumentRoutes = new CDocumentRoutes();
