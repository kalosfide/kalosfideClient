import { Menu } from '../disposition/menus/menu';
import { PageDef } from '../commun/page-def';
import { ISiteRoutes } from './site-pages';
import { ItemDeMenu } from '../disposition/menus/item-de-menu';
import { Site } from '../modeles/site';
import { TypeItemDeMenu } from '../disposition/menus/type-item-de-menu';

export abstract class SiteMenu extends Menu {
    site: Site;
    routes: ISiteRoutes;

    protected créeMarqueTexte(): ItemDeMenu {
        const i = new ItemDeMenu('texteMarque', this, TypeItemDeMenu.item);
        i.navBarBrand = true;
        i.rafraichit = () => {
            i.texte = this.site.titre;
            i.url = this.routes.url(this.site.nomSite);
        };
        return i;
    }

    protected créeItemDeSite(pageDef: PageDef, routes: ISiteRoutes): ItemDeMenu {
        const item = new ItemDeMenu(pageDef.urlSegment, this, TypeItemDeMenu.item);
        item.texte = pageDef.lien;
        item.url = this.routes.url(this.site.nomSite, [pageDef.urlSegment]);
        return item;
    }
}
