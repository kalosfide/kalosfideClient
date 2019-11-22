import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavBar } from './navbar';
import { NavItem } from './nav-item';
import { KfGèreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfNgClasse } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css-classe';
import { NavItemContenu } from './nav-item-contenu';

export class NavItemUlLi extends NavItem {
    private _gèreCss: KfGèreCss;
    private _items: NavItemContenu[];

    constructor(nom: string, parent: NavBar) {
        super(nom, parent);
        this._items = [];
        this._quandChange = () => {
            this._items.forEach(item => item.quandChange());
        };
    }

    get composant(): KfComposant {
        return null;
    }

    get items(): NavItemContenu[] {
        return this._items;
    }

    get gèreCss(): KfGèreCss {
        if (!this._gèreCss) {
            this._gèreCss = new KfGèreCss();
        }
        return this._gèreCss;
    }

    get classe(): KfNgClasse {
        if (this._gèreCss) {
            return this._gèreCss.classe;
        }
    }

    get style(): KfNgClasse {
        if (this._gèreCss) {
            return this._gèreCss.style;
        }
    }

    fermeQuandClick() {
        this._items.forEach(i => i.fermeQuandClick());
    }

    ajoute(item: NavItemContenu) {
        this._items.push(item);
    }
}
