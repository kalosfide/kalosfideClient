import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';

export class FSitePages  {
    static ouverture: PageDef = {
        urlSegment: 'ouverture',
        lien: '',
        title: 'Ouverture',
        titre: 'Ouverture du site',
    };
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Retour à la liste des produits',
        title: 'Produits',
        titre: '',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Produits - Modifier',
        titre: 'Modifier un produit',
    };
}

class CFSiteRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FournisseurPages.site.urlSegment);
        if (segments) {
            s = s.concat(segments);
        }
        return FournisseurRoutes.url(nomSite, s);
    }
}
export const FSiteRoutes = new CFSiteRoutes();
