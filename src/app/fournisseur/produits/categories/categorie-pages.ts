import { ProduitPages, ProduitRoutes } from '../produit-pages';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';
import { IDataPages } from 'src/app/commun/data-par-key/data-pages';

export class CategoriePages {
    static index: PageDef = {
        urlSegment: 'index',
        lien: 'Retour à la liste des catégories',
        title: 'Catégories',
        titre: 'Catégories',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        lien: 'Créer une nouvelle catégorie',
        title: 'Catégories - Créer',
        titre: 'Créer une nouvelle catégorie',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        lien: 'Modifier',
        title: 'Catégories - Modifier',
        titre: 'Modifier une catégorie',
    };
    static supprime: PageDef = {
        urlSegment: 'supprime',
        lien: 'Supprimer',
        title: 'Catégories - Supprimer',
        titre: 'Supprimer un catégorie',
    };
}

class CCategorieRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(ProduitPages.categories.urlSegment);
        s = s.concat(segments);
        return ProduitRoutes.url(nomSite, s);
    }
}
export const CategorieRoutes = new CCategorieRoutes();
