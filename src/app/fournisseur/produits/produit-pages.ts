import { ISiteRoutes, SitePages } from 'src/app/site/site-pages';
import { FournisseurRoutes } from '../fournisseur-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';

export class ProduitPages {
    static accueil: PageDef = {
        urlSegment: 'accueil',
        lien: '',
        title: 'Produits',
        titre: 'Produits',
    };
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Produits',
        title: 'Produits',
        titre: 'Produits',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        lien: 'Nouveau produit',
        title: 'Produits - Créer',
        titre: 'Créer un nouveau produit',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Produits - Modifier',
        titre: 'Modifier un produit',
    };
    static prix: PageDef = {
        urlSegment: 'prix',
        lien: 'Fixer le prix',
        title: 'Produits - Fixer le prix',
        titre: 'Fixer le prix d\'un produit',
    };
    static categories: PageDef = {
        urlSegment: 'categories',
        lien: 'Catégories',
        title: 'Produits - Catégories',
        titre: 'Catégories',
    };
    static supprime: PageDef = {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Produits - Supprimer',
        titre: 'Supprimer un produit',
    };
}

class CProduitRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(SitePages.produits.urlSegment);
        if (segments) {
            s = s.concat(segments);
        }
        return FournisseurRoutes.url(nomSite, s);
    }
}
export const ProduitRoutes = new CProduitRoutes;
