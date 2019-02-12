import { ItemCompte } from './item-compte';
import { ItemDeMenu } from 'src/app/disposition/menus/item-de-menu';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSite } from 'src/app/app-site/app-site';
import { TypeItemDeMenu } from 'src/app/disposition/menus/type-item-de-menu';

export class ItemMesSites extends ItemDeMenu {
    constructor(parent: ItemCompte) {
        super('mesSites', parent, TypeItemDeMenu.dropdownGroup);
        this.dropDownDivider = true;
        this.rafraichit = () => {
            let roles = this.identifiant ? this.identifiant.roles : [];
            if (this.site) {
                roles = roles.filter(r => r.nomSite !== this.site.nomSite);
            }
            roles.forEach(r => {
                const item = new ItemDeMenu(r.nomSite, this, TypeItemDeMenu.dropdownItem);
                item.texte = r.nomSite + '@' + AppSite.nom;
                item.url = SiteRoutes.urlSite(r.nomSite, this.identifiant);
               this.ajoute(item);
            });
        };
    }
}
