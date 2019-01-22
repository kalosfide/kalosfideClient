import { ItemCompte } from './item-compte';
import { ItemDeMenu } from 'src/app/menus/item-de-menu';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';

export class ItemMonCompte extends ItemDeMenu {

    constructor(parent: ItemCompte) {
        super('monCompte', parent);
        this.dropDownDivider = true;
        this.sousMenu = [];

        this.rafraichit = () => {
            this.sousMenu = [];
            if (this.identifiant) {
                const itemMonCompte = new ItemDeMenu(ComptePages.gestion.urlSegment, this);
                itemMonCompte.texte = ComptePages.gestion.lien;
                itemMonCompte.url = this.site
                    ? SiteRoutes.urlSite(this.site.nomSite, this.identifiant, CompteRoutes.route([ComptePages.gestion.urlSegment]))
                    : AppSiteRoutes.url(CompteRoutes.route([ComptePages.gestion.urlSegment]));
                this.sousMenu.push(itemMonCompte);
            }
        };
    }
}
