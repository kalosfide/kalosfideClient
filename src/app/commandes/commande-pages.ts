import { SitePages, ISiteRoutes } from '../site/site-pages';
import { ClientRoutes } from '../client/client-pages';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { PageDef, BaseRoutes } from '../commun/page-def';

export class CommandePages {
    static liste: PageDef = {
        urlSegment: 'liste',
        lien: 'Retour au bon de commande',
        title: 'Bon',
        titre: 'Bon de commande',
    };
    static choixProduit: PageDef = {
        urlSegment: 'produit',
        title: 'Choix produit',
        titre: 'Choisir un produit',
    };
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        title: 'Ajoute',
        titre: 'Ajouter un produit',
    };
    static edite: PageDef = {
        urlSegment: 'edite',
        title: 'Edite',
        titre: 'Modifier la ligne',
    };
    static supprime: PageDef = {
        urlSegment: 'supprime',
        title: 'Supprime',
        titre: 'Supprimer la ligne',
    };
    static efface: PageDef = {
        urlSegment: 'efface',
        title: 'Efface',
        titre: 'Supprimer toutes les lignes',
    };
}

class CCommandeRoutes extends BaseRoutes implements ISiteRoutes {
    parentRoutes: ISiteRoutes;

    constructor(parentRoutes: ISiteRoutes) {
        super();
        this.parentRoutes = parentRoutes;
    }

    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(SitePages.commandes.urlSegment);
        s = s.concat(segments);
        return this.parentRoutes.url(nomSite, s);
    }
}
export const ClientCommandeRoutes = new CCommandeRoutes(ClientRoutes);
export const FournisseurCommandeRoutes = new CCommandeRoutes(FournisseurRoutes);
