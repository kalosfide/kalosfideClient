import { KfComposant } from '../kf-composant/kf-composant';
import { KfMenu } from './kf-menu';
import { KfParametres } from '../kf-composants-parametres';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfTraitementDEvenement, KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfElement } from '../kf-composant/kf-element';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfDefinitionDeMenu, KfMenuDirection, KfTypeDeSousMenu } from './kf-menu-types';
import { KfLien } from '../kf-elements/kf-lien/kf-lien';

export class KfSousMenu extends KfElement {
    itemId: any;

    private _ouvert: boolean;

    peutEtreChoisi?: boolean;

    constructor(no: number, def: KfDefinitionDeMenu) {
        super(KfParametres.menuParDefaut.nomDeBase + no, KfTypeDeComposant.sousmenu);
        this.itemId = def.id;
        this._ouvert = true;
        let selecteur: KfComposant;
        switch (def.type) {
            case KfTypeDeSousMenu.etiquette:
                selecteur = new KfEtiquette(KfParametres.menuParDefaut.nomDeBaseSelecteur + no, def.texte, def.imageAvant, def.imageApres);
                break;
            case KfTypeDeSousMenu.bouton:
                selecteur = new KfBouton(KfParametres.menuParDefaut.nomDeBaseSelecteur + no, def.texte, def.imageAvant, def.imageApres);
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, this.traiteClicSurSelecteur);
                break;
            case KfTypeDeSousMenu.lien:
                selecteur = new KfLien(KfParametres.menuParDefaut.nomDeBaseSelecteur + no, def.texte, def.imageAvant, def.imageApres);
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, this.traiteClicSurSelecteur);
                break;
            case KfTypeDeSousMenu.special:
                selecteur = def.selecteur;
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, this.traiteClicSurSelecteur);
                break;
            default:
                break;
        }
        if (def.inactivitéFnc) {
            selecteur.inactivitéFnc = def.inactivitéFnc;
        }
        this.ajouteClasse('kf-sous-menu');
        this.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant as KfSousMenu;
            return sousmenu.niveau === 1 ? sousmenu.menu.classe : KfMenuDirection.vertical;
        });
        this.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant as KfSousMenu;
            return 'kf-niveau-' + sousmenu.niveau;
        });
        this.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant as KfSousMenu;
            return sousmenu.sansSousMenus ? null : sousmenu.ouvert ? 'kf-ouvert' : 'kf-ferme';
        });
        selecteur.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant.parent as KfSousMenu;
            return sousmenu.niveau === 1 ? sousmenu.menu.classe : KfMenuDirection.vertical;
        });
        selecteur.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant.parent as KfSousMenu;
            return 'kf-niveau-' + sousmenu.niveau;
        });
        selecteur.ajouteClasse((composant: KfComposant) => {
            const sousmenu = composant.parent as KfSousMenu;
            return sousmenu.sansSousMenus ? null : sousmenu.ouvert ? 'kf-ouvert' : 'kf-ferme';
        });
        this.noeud.Ajoute(selecteur.noeud);
        this._ouvert = true;
    }

    get contenus(): KfComposant[] {
        return this.enfants;
    }

    get selecteur(): KfComposant {
        return this.enfants[0];
    }

    get sansSousMenus(): boolean {
        return !this.noeud.enfant.suivant;
    }

    get sousMenus(): KfSousMenu[] {
        return this.enfants.slice(1).map(c => c as KfSousMenu);
    }

    get menu(): KfMenu {
        if (!(this.parent as KfSousMenu).itemId) {
            return this.parent as KfMenu;
        }
        return (this.parent as KfSousMenu).menu;
    }

    get ouvert(): boolean {
        return this._ouvert;
    }
    set ouvert(ouvert: boolean) {
        this._ouvert = ouvert;
    }

    get niveau(): number {
        return (this.parent as KfMenu | KfSousMenu).niveau + 1;
    }

    // utilisée dans le template pour rendre invisible les fermés
    get classeOuvrirFermer(): string {
        return this.sansSousMenus ? 'kf-feuille' : this.ouvert ? 'kf-ouvert' : 'kf-ferme';
    }

    get estSurLaRouteDuChoisi(): boolean {
        let contientChoisi = false;
        if (this.sansSousMenus) {
            contientChoisi = this === this.menu.feuilleChoisie;
        } else {
            this.sousMenus.forEach(sm => contientChoisi = contientChoisi || sm.estSurLaRouteDuChoisi);
        }
        return contientChoisi;
    }

    get avecKfChoisi(): boolean {
        let choisi = false;
        if (this.sansSousMenus) {
            choisi = this === this.menu.feuilleChoisie;
        } else {
            choisi = this.estSurLaRouteDuChoisi && !this.ouvert;
        }
        return choisi;
    }

    traiteClicSurSelecteur: KfTraitementDEvenement = (evenement: KfEvenement) => {
        // on transforme l'évènement clic
        evenement.type = KfTypeDEvenement.menuChange;
        evenement.emetteur = this;
        evenement.parametres = this.itemId;
        evenement.statut = KfStatutDEvenement.aTraiter; // non traité pour transmettre jusqu'au menu
    }

}
