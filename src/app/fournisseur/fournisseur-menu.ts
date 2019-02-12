
import { ItemDeMenu } from '../disposition/menus/item-de-menu';
import { TypeAutorisation } from '../securite/autorisation';
import { FournisseurRoutes, FournisseurPages } from './fournisseur-pages';
import { Site } from '../modeles/site';
import { Identifiant } from '../securite/identifiant';
import { SiteMenu } from '../site/site-menu';

export class FournisseurMenu extends SiteMenu {
    routes = FournisseurRoutes;

    protected créeItemsAction(): ItemDeMenu[] {
        return [
            this.créeItemDeSite(FournisseurPages.produits, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.commandes, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.livraisons, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.factures, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.documents, FournisseurRoutes),
            this.créeItemDeSite(FournisseurPages.site, FournisseurRoutes),
        ];
    }

}
