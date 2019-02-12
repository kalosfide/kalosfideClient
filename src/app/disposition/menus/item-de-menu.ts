import { TypeItemDeMenu } from './type-item-de-menu';
import { Menu } from './menu';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Autorisation, TypeAutorisation } from 'src/app/securite/autorisation';
import { KfImageDef } from 'src/app/commun/kf-composants/kf-partages/kf-image-def';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { KfNgbDropdown, KfNgbDropdownGroup } from 'src/app/commun/kf-composants/kf-elements/kf-ngb-dropdown/kf-ngb-dropdown';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class ItemDeMenu {
    nom: string;
    parent: Menu | ItemDeMenu;
    type: TypeItemDeMenu;
    get parentEstMenu(): boolean {
        return !(this.parent as ItemDeMenu).type;
    }

    composant: KfLien | KfNgbDropdown | KfNgbDropdownGroup;
    get lien(): KfLien {
        if (this.type === TypeItemDeMenu.item || this.type === TypeItemDeMenu.dropdownItem) {
            return this.composant as KfLien;
        }
    }
    get dropdown(): KfNgbDropdown {
        if (this.type === TypeItemDeMenu.dropdown) {
            return this.composant as KfNgbDropdown;
        }
    }
    get dropdownGroup(): KfNgbDropdownGroup {
        if (this.type === TypeItemDeMenu.dropdownGroup) {
            return this.composant as KfNgbDropdownGroup;
        }
    }

    private _autorisationActivité: Autorisation;
    private _autorisationVisibilité: Autorisation;

    private _items: ItemDeMenu[];
    /**
     * uniquement pour les dropdown et les dropdownGroup dans le template
     */
    get items(): ItemDeMenu[] {
        if (this.type === TypeItemDeMenu.dropdown || this.type === TypeItemDeMenu.dropdownGroup) {
            return this._items;
        }
        throw new Error(`L'item de menu ${this.nom} n'a pas de sous-items`);
    }

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

    constructor(nom: string, parent: Menu | ItemDeMenu, type: TypeItemDeMenu) {
        this.nom = nom;
        this.parent = parent;
        this.type = type;
        let lien: KfLien;
        switch (type) {
            case TypeItemDeMenu.item:
                lien = new KfLien(nom);
                lien.ajouteClasseDef(
                    'nav-link',
                    () => this.inactif ? 'disabled' : '',
                    () => this.navBarBrand ? 'navbar-brand' : '');
                this.composant = lien;
                break;
            case TypeItemDeMenu.dropdown:
                const dropDown = new KfNgbDropdown(nom);
                this._items = [];
                this.composant = dropDown;
                break;
            case TypeItemDeMenu.dropdownItem:
                lien = new KfLien(nom);
                lien.ajouteClasseDef(
                    'nav-link dropdown-item',
                    () => this.inactif ? 'disabled' : '');
                this.composant = lien;
                break;
            case TypeItemDeMenu.dropdownGroup:
                const dropDownGroup = new KfNgbDropdownGroup(nom);
                this._items = [];
                this.composant = dropDownGroup;
                break;
            default:
                break;
        }
    }

    set texte(texte: KfTexteDef) {
        if (this.lien) {
            this.lien.fixeTexte(texte);
            return;
        }
        if (this.dropdown) {
            this.dropdown.bouton.fixeTexte(texte);
            return;
        }
    }

    set image(image: KfImageDef) {
        if (this.lien) {
            this.lien.fixeImage(image);
            return;
        }
        if (this.dropdown) {
            this.dropdown.bouton.fixeImage(image);
            return;
        }
    }

    set icone(icone: IconDefinition) {
        if (this.lien) {
            this.lien.fixeIcone(icone);
            return;
        }
        if (this.dropdown) {
            this.dropdown.bouton.fixeIcone(icone);
            return;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        if (this.lien) {
            return this.lien.contenuPhrase;
        }
        if (this.dropdown) {
            return this.dropdown.bouton.contenuPhrase;
        }
    }

    set url(url: KfTexteDef) {
        if (this.lien) {
            this.lien.fixeRoute(url);
        }
    }

    ajoute(item: ItemDeMenu) {
        switch (this.type) {
            case TypeItemDeMenu.dropdown:
                if (item.type === TypeItemDeMenu.dropdownItem || item.type === TypeItemDeMenu.dropdownGroup) {
                    this.dropdown.ajoute(item.composant);
                    this._items.push(item);
                }
                return;
            case TypeItemDeMenu.dropdownGroup:
                if (item.type === TypeItemDeMenu.dropdownItem) {
                    this.dropdownGroup.ajoute(item.lien);
                    this._items.push(item);
                }
                return;
            default:
                break;
        }
        throw new Error(`Ajout de ${item.nom} à l'item de menu ${this.nom} interdit.`);
    }

    get menu(): Menu {
        return this.parent.menu;
    }

    get site(): Site {
        return this.menu.site;
    }
    get identifiant(): Identifiant {
        return this.parent.identifiant;
    }

    fixeAutorisationActivité(typeA: TypeAutorisation) {
        this._autorisationActivité = new Autorisation(typeA);
    }

    fixeAutorisationVisibilité(typeA: TypeAutorisation) {
        this._autorisationVisibilité = new Autorisation(typeA);
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
        if (this._items) {
            this._items.forEach(item => item.quandChange());
        }
    }
}
