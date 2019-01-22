import { Menu } from '../menus/menu';
import { ItemDeMenu } from '../menus/item-de-menu';
import { PageDef } from '../commun/page-def';
import { AppSiteRoutes, AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';
import { AppRoutes } from '../app-pages';
import { ItemCompte } from '../compte/menu/item-compte';

export class AppSiteMenu extends Menu {

    private créeItemApp(pageDef: PageDef): ItemDeMenu {
        const item = new ItemDeMenu(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = AppSiteRoutes.url([pageDef.urlSegment]);
        return item;
    }

    protected créeMarqueTexte(): ItemDeMenu {
        const i = new ItemDeMenu('texteMarque', this);
        i.navBarBrand = true;
        i.texte = AppSite.texte;
        i.url = AppRoutes.url();
        return i;
    }

    protected créeItemsAction(): ItemDeMenu[] {
        return [
            this.créeItemApp(AppSitePages.sites),
            this.créeItemApp(AppSitePages.contact),
            this.créeItemApp(AppSitePages.apropos),
        ];
    }

    private créeItemDevenirFournisseur(parent: ItemCompte): ItemDeMenu {
        const itemDevenir = new ItemDeMenu('devenir', parent);
        itemDevenir.dropDownDivider = true;
        const itemFournisseur = new ItemDeMenu(AppSitePages.devenirFournisseur.urlSegment, this);
        itemFournisseur.url = AppSiteRoutes.url([AppSitePages.devenirFournisseur.urlSegment]);
        itemFournisseur.texte = AppSitePages.devenirFournisseur.lien;
        itemDevenir.sousMenu = [itemFournisseur];
        return itemDevenir;
    }

    protected créeItemCompte(): ItemDeMenu {
        const i = new ItemCompte(this);
        i.sousMenu.push(this.créeItemDevenirFournisseur(i));
        return i;
    }

}
