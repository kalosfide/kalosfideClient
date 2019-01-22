import { Menu } from '../menus/menu';
import { PageDef } from '../commun/page-def';
import { ISiteRoutes } from './site-pages';
import { ItemDeMenu } from '../menus/item-de-menu';
import { Site } from '../modeles/site';

export abstract class SiteMenu extends Menu {
    site: Site;
    routes: ISiteRoutes;

    protected créeMarqueTexte(): ItemDeMenu {
        const i = new ItemDeMenu('texteMarque', this);
        i.navBarBrand = true;
        i.rafraichit = () => {
            i.texte = this.site.titre;
            i.url = this.routes.url(this.site.nomSite);
        };
        return i;
    }

    protected créeItemDeSite(pageDef: PageDef, routes: ISiteRoutes): ItemDeMenu {
        const item = new ItemDeMenu(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = this.routes.url(this.site.nomSite, [pageDef.urlSegment]);
        return item;
    }
}
