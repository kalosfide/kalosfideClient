import { ItemCompte } from './item-compte';
import { ItemDeMenu } from 'src/app/disposition/menus/item-de-menu';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';
import { TypeItemDeMenu } from 'src/app/disposition/menus/type-item-de-menu';

export class ItemMonCompte extends ItemDeMenu {

    constructor(parent: ItemCompte) {
        super('monCompte', parent, TypeItemDeMenu.dropdownGroup);
        this.dropDownDivider = true;

        this.rafraichit = () => {
            if (this.identifiant) {
                const itemMonCompte = new ItemDeMenu(ComptePages.gestion.urlSegment, this, TypeItemDeMenu.dropdownItem);
                itemMonCompte.texte = ComptePages.gestion.lien;
                itemMonCompte.url = this.site
                    ? SiteRoutes.urlSite(this.site.nomSite, this.identifiant, CompteRoutes.route([ComptePages.gestion.urlSegment]))
                    : AppSiteRoutes.url(CompteRoutes.route([ComptePages.gestion.urlSegment]));
                this.ajoute(itemMonCompte);
            }
        };
    }
}
