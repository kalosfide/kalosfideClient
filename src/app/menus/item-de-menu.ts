import { KfImageDef } from '../commun/kf-composants/kf-partages/kf-image-def/kf-image-def';
import { Menu } from './menu';
import { Autorisation, TypeAutorisation } from '../securite/autorisation';
import { Identifiant } from '../securite/identifiant';
import { Site } from '../modeles/site';

export class ItemDeMenu {
    nom: string;
    parent: Menu | ItemDeMenu;
    private _autorisationActivité: Autorisation;
    private _autorisationVisibilité: Autorisation;

    constructor(nom: string, parent: Menu | ItemDeMenu) {
        this.nom = nom;
        this.parent = parent;
    }

    texte?: string;
    image?: KfImageDef;
    // si route est défini pas de sousMenu
    url?: string;
    params?: any;

    sousMenu?: ItemDeMenu[];
    sousMenuADroite?: boolean;

    navBarBrand?: boolean;
    dropDownDivider?: boolean;

    private _inactif = false;
    get inactif(): boolean { return this._inactif; }
    set inactif(valeur: boolean) { this._inactif = valeur; }

    private _visible = true;
    get visible(): boolean { return this._visible; }
    set visible(valeur: boolean) { this._visible = valeur; }

    rafraichit?: () => void;

    get menu(): Menu {
        return this.parent.menu;
    }

    get site(): Site {
        return this.menu.site;
    }
    get identifiant(): Identifiant {
        return this.parent.identifiant;
    }

    get type(): string {
        if (!this.sousMenu) {
            return (this.parent as ItemDeMenu).type ? 'dropDownItem' : 'item';
        }
        if (this.dropDownDivider) {
            return this.sousMenu.length > 0 ? 'dropDownGroup' : 'ne-pas-afficher';
        }
        return 'dropDown';
    }

    get route(): any {
        const route: any[] = [this.url];
        if (this.params) {
            route.push(this.params);
        }
        return route;
    }

    fixeAutorisationActivité(type: TypeAutorisation) {
        this._autorisationActivité = new Autorisation(type);
    }

    fixeAutorisationVisibilité(type: TypeAutorisation) {
        this._autorisationVisibilité = new Autorisation(type);
    }

    vérifieAutorisation() {
        const menu = this.menu;
        const identifiant = menu.identifiant;
        const site = menu.site;
        this.inactif = this._autorisationActivité ? !this._autorisationActivité.autorise(identifiant, site) : false;
        this.visible = this._autorisationVisibilité ? this._autorisationVisibilité.autorise(identifiant, site) : true;
    }

    quandChange() {
        if (this._autorisationActivité || this._autorisationVisibilité) {
            this.vérifieAutorisation();
        }
        if (this.rafraichit) {
            this.rafraichit();
        }
        if (this.sousMenu) {
            this.sousMenu.forEach(item => item.quandChange());
        }
    }
}
