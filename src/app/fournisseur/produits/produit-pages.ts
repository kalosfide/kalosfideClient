import { ISiteRoutes, SitePages } from 'src/app/site/site-pages';
import { FournisseurRoutes } from '../fournisseur-pages';

export const ProduitPages = {
    accueil: {
        urlSegment: 'accueil',
        lien: '',
        title: 'Produits',
        titre: 'Produits',
    },
    modif: {
        urlSegment: 'e'
    },
};

class CProduitRoutes implements ISiteRoutes {
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

export const ProduitModifPages = {
    index: {
        urlSegment: 'index',
        lien: 'Retour à la liste des produits',
        title: 'Produits',
        titre: 'Produits',
    },
    ajoute: {
        urlSegment: 'ajoute',
        lien: 'Créer un nouveau produit',
        title: 'Produits - Créer',
        titre: 'Créer un nouveau produit',
    },
    edite: {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Produits - Modifier',
        titre: 'Modifier un produit',
    },
    prix: {
        urlSegment: 'prix',
        lien: 'Fixer le prix',
        title: 'Produits - Fixer le prix',
        titre: 'Fixer le prix d\'un produit',
    },
    categories: {
        urlSegment: 'categories',
        lien: 'Gérer les catégories de produit',
        title: 'Produits - Catégories',
        titre: 'Catégories de produits',
    },
    supprime: {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Produits - Supprimer',
        titre: 'Supprimer un produit',
    },
};

class CProduitModifRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(ProduitPages.modif.urlSegment);
        if (segments) {
            s = s.concat(segments);
        }
        return ProduitRoutes.url(nomSite, s);
    }
}
export const ProduitModifRoutes = new CProduitModifRoutes;
