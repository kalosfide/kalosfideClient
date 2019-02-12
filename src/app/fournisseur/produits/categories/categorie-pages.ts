import { ProduitPages, ProduitRoutes } from '../produit-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';

export const CategoriePages = {
    index: {
        urlSegment: 'index',
        lien: 'Retour à la liste des catégories',
        title: 'Catégories de produits',
        titre: 'Catégories de produits',
    },
    ajoute: {
        urlSegment: 'ajoute',
        lien: 'Créer une nouvelle catégorie',
        title: 'Catégories de produits - Créer',
        titre: 'Créer une nouvelle catégorie',
    },
    edite: {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Catégories de produits - Modifier',
        titre: 'Modifier une catégorie',
    },
    supprime: {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Catégories de produits - Supprimer',
        titre: 'Supprimer un catégorie',
    },
};

class CCategorieRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(ProduitPages.categories.urlSegment);
        s = s.concat(segments);
        return ProduitRoutes.url(nomSite, s);
    }
}
export const CategorieRoutes = new CCategorieRoutes();
