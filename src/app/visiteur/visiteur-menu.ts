import { ItemDeMenu } from '../menus/item-de-menu';
import { SiteMenu } from '../site/site-menu';
import { VisiteurRoutes, VisiteurPages } from './visiteur-pages';
import { ItemCompte } from '../compte/menu/item-compte';

export class VisiteurMenu extends SiteMenu {
    routes = VisiteurRoutes;

    protected créeItemsAction(): ItemDeMenu[] {
        return [
            this.créeItemDeSite(VisiteurPages.produits, VisiteurRoutes),
            this.créeItemDeSite(VisiteurPages.contact, VisiteurRoutes),
            this.créeItemDeSite(VisiteurPages.apropos, VisiteurRoutes),
        ];
    }

    private créeItemDevenirClient(): ItemDeMenu {
        const devenir = new ItemDeMenu('devenir', this);
        devenir.dropDownDivider = true;
        const client = new ItemDeMenu(VisiteurPages.devenirClient.urlSegment, this);
        client.texte = VisiteurPages.devenirClient.lien;
        client.url = VisiteurRoutes.url(this.menu.site.nomSite, [VisiteurPages.devenirClient.urlSegment]);
        devenir.sousMenu = [client];
        return devenir;
    }

    protected créeItemCompte(): ItemDeMenu {
        const i = new ItemCompte(this);
        i.sousMenu.push(this.créeItemDevenirClient());
        return i;
    }

}
