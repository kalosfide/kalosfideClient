
import { FournisseurRoutes, FournisseurPages } from './fournisseur-pages';
import { SiteMenu } from '../site/site-menu';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';

export class FournisseurMenu extends SiteMenu {
    routes = FournisseurRoutes;

    protected créeItemsAction(): NavItemLien[] {
        return [
            this.créeItemDeSite(FournisseurPages.produits, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.livraison, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.factures, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.documents, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.clients, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.site, FournisseurRoutes),
        ];
    }

}
