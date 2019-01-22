import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';

export const FSitePages = {
    ouverture: {
        urlSegment: 'ouverture',
        lien: '',
        title: 'Ouverture',
        titre: 'Ouverture du site',
    },
    index: {
        urlSegment: 'index',
        lien: 'Retour à la liste des produits',
        title: 'Produits',
        titre: '',
    },
    edite: {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Produits - Modifier',
        titre: 'Modifier un produit',
    },
};

class CFSiteRoutes implements ISiteRoutes {
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
