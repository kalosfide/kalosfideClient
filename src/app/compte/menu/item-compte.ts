import { ItemDeMenu } from '../../menus/item-de-menu';
import { Menu } from '../../menus/menu';
import { ItemConnection } from './item-connection';
import { ItemMesSites } from './item-mes-sites';
import { ItemMonCompte } from './item-mon-compte';

export class ItemCompte extends ItemDeMenu {

    constructor(parent: Menu) {
        super('compte', parent);
        this.sousMenu = [];
        this.sousMenuADroite = true;

        this.sousMenu.push(new ItemConnection(this));
        this.sousMenu.push(new ItemMesSites(this));
        this.sousMenu.push(new ItemMonCompte(this));

        this.rafraichit = () => {
            if (this.identifiant) {
                this.texte = this.identifiant.userName;
            } else {
                this.texte = 'Compte';
            }
        };
    }

}
