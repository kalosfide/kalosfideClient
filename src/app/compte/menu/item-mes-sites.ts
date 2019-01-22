import { ItemCompte } from './item-compte';
import { ItemDeMenu } from 'src/app/menus/item-de-menu';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSite } from 'src/app/app-site/app-site';

export class ItemMesSites extends ItemDeMenu {
    constructor(parent: ItemCompte) {
        super('mesSites', parent);
        this.dropDownDivider = true;
        this.rafraichit = () => {
            this.sousMenu = this.identifiant
            ? this.identifiant.roles.map(r => {
                const item = new ItemDeMenu(r.nomSite, this);
                item.texte = r.nomSite + '@' + AppSite.nom;
                item.url = SiteRoutes.urlSite(r.nomSite, this.identifiant);
                return item;
            })
            : [];
        };
    }
}
