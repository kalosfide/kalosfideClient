
import { ClientRoutes, ClientPages } from '../client/client-pages';
import { Site } from '../modeles/site';
import { Identifiant } from '../securite/identifiant';
import { SiteMenu } from '../site/site-menu';

export class ClientMenu extends SiteMenu {
    routes = ClientRoutes;

    protected créeItemsAction() {
        return [
            this.créeItemDeSite(ClientPages.produits, ClientRoutes),
            this.créeItemDeSite(ClientPages.commandes, ClientRoutes),
            this.créeItemDeSite(ClientPages.documents, ClientRoutes),
            this.créeItemDeSite(ClientPages.contact, ClientRoutes),
        ];
    }

}
