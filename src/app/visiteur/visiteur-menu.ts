import { ItemDeMenu } from '../disposition/menus/item-de-menu';
import { SiteMenu } from '../site/site-menu';
import { VisiteurRoutes, VisiteurPages } from './visiteur-pages';
import { ItemCompte } from '../compte/menu/item-compte';
import { TypeItemDeMenu } from '../disposition/menus/type-item-de-menu';

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
        const devenir = new ItemDeMenu('devenir', this, TypeItemDeMenu.dropdownGroup);
        devenir.dropDownDivider = true;
        const client = new ItemDeMenu(VisiteurPages.devenirClient.urlSegment, this, TypeItemDeMenu.dropdownItem);
        client.texte = VisiteurPages.devenirClient.lien;
        client.url = VisiteurRoutes.url(this.menu.site.nomSite, [VisiteurPages.devenirClient.urlSegment]);
        devenir.ajoute(client);
        return devenir;
    }

    protected créeItemCompte(): ItemDeMenu {
        const i = new ItemCompte(this);
        i.ajoute(this.créeItemDevenirClient());
        return i;
    }

}
