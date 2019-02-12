import { Menu } from '../disposition/menus/menu';
import { ItemDeMenu } from '../disposition/menus/item-de-menu';
import { PageDef } from '../commun/page-def';
import { AppSiteRoutes, AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';
import { AppRoutes } from '../app-pages';
import { ItemCompte } from '../compte/menu/item-compte';
import { TypeItemDeMenu } from '../disposition/menus/type-item-de-menu';

export class AppSiteMenu extends Menu {

    private créeItemApp(pageDef: PageDef): ItemDeMenu {
        const item = new ItemDeMenu(pageDef.urlSegment, this, TypeItemDeMenu.item);
        item.texte = pageDef.lien;
        item.url = AppSiteRoutes.url([pageDef.urlSegment]);
        return item;
    }

    protected créeMarqueTexte(): ItemDeMenu {
        const i = new ItemDeMenu('texteMarque', this, TypeItemDeMenu.item);
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
        const itemDevenir = new ItemDeMenu('devenir', parent, TypeItemDeMenu.dropdownGroup);
        itemDevenir.dropDownDivider = true;
        const itemFournisseur = new ItemDeMenu(AppSitePages.devenirFournisseur.urlSegment, this, TypeItemDeMenu.dropdownItem);
        itemFournisseur.url = AppSiteRoutes.url([AppSitePages.devenirFournisseur.urlSegment]);
        itemFournisseur.texte = AppSitePages.devenirFournisseur.lien;
        itemDevenir.ajoute(itemFournisseur);
        return itemDevenir;
    }

    protected créeItemCompte(): ItemDeMenu {
        const i = new ItemCompte(this);
        i.ajoute(this.créeItemDevenirFournisseur(i));
        return i;
    }

}
