import { ItemDeMenu } from '../../disposition/menus/item-de-menu';
import { Menu } from '../../disposition/menus/menu';
import { ItemConnection } from './item-connection';
import { ItemMesSites } from './item-mes-sites';
import { ItemMonCompte } from './item-mon-compte';
import { TypeItemDeMenu } from 'src/app/disposition/menus/type-item-de-menu';
import { faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { KfIcone, TypeEchelleIcone,
    TypePositionHIcone, TypePositionVIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';

export class ItemCompte extends ItemDeMenu {

    constructor(parent: Menu) {
        super('compte', parent, TypeItemDeMenu.dropdown);
        this.dropdown.placement = 'bottom-right';
        this.sousMenuADroite = true;

        this.ajoute(new ItemConnection(this));
        this.ajoute(new ItemMesSites(this));
        this.ajoute(new ItemMonCompte(this));

        const anonyme = new KfIcone('anonyme', faUser);
        const identifie = new KfIcone('identifie', faUser);
        identifie.style = { 'color': 'Dark' };
        const coche = identifie.empileIcone(faCheck);
        coche.echelleType = TypeEchelleIcone.réduit;
        coche.echelleValeur = 6;
        coche.positionHType = TypePositionHIcone.droite;
        coche.positionHValeur = 8;
        coche.positionVType = TypePositionVIcone.bas;
        coche.positionVValeur = 4;
        coche.style = { 'color': 'Tomato' };

        this.rafraichit = () => {
            if (this.identifiant) {
                this.contenuPhrase.contenus = [identifie];
            } else {
                this.contenuPhrase.contenus = [anonyme];
            }
        };
    }

}
