import {
    KfEvenement, KfTypeDEvenement,
    KfTraitementDEvenement, KFTraiteurDEvenement, KfTypeDHTMLEvents, KfStatutDEvenement
} from '../kf-partages/kf-evenements';
import { KfComposant } from './kf-composant';
import { KfdocumentContexte } from '../kf-constantes';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton, KfTypeDeComposant } from '../kf-composants-types';

enum KfKeyboardKey {
    enter = 'Enter',
    space = ' ',
    down = 'ArrowDown',
    left = 'ArrowLeft',
    right = 'ArrowRight',
    up = 'ArrowUp',
}

export class KfComposantGereHtml {
    /**
     * composant dont les html elements sont gérés par this
     */
    composant: KfComposant;

    /**
     * HTMLElement du composant qui emet ses évènements DOM
     */
    htmlElement: HTMLElement;
    /**
     * enfantsDeVue: { [key: string]: HTMLElement };
     *  après AfterViewInit, certains ViewChild de l'Angular component sont enregistrés
     *  en tant que champs de enfantsDeVue
     */
    enfantsDeVue: { [key: string]: HTMLElement };

    /**
     * liste des types d'évènements du DOM que le htmlElement du composant doit déclencher
     * certains sont fixés par le type du composant et les options de this
     * d'autres peuvent être ajoutés par le programmeur
     */
    evenementsADéclencher: KfTypeDHTMLEvents[];

    /**
     *  array des kf event handlers du groupe
     */
    traiteurDEvenements: KFTraiteurDEvenement[];

    /**
     * si suitLeStatut, le component emet un KfEvenenment statutChange en réponse à un événement statusChanges de l'abstractControl
     */
    suitLeStatut: boolean;
    /** permet de suspendre le suivi du statut et de la valeur */
    suspendSuitLeStatut: boolean;
    /**
     * si suitLaValeur, le component emet un KfEvenenment valeurChange en réponse à un événement valueChanges de l'abstractControl
     */
    suitLaValeur: boolean;
    /** permet de suspendre le suivi du statut et de la valeur */
    suspendSuitLaValeur: boolean;

    suitLeFocus: boolean;

    constructor(composant: KfComposant) {
        this.composant = composant;
    }

    // DEFINITION
    /**
     * ajoute un évènement à écouter
     */
    ajouteEvenementASuivre(typeDHtmlEvent: KfTypeDHTMLEvents) {
        if (!this.evenementsADéclencher) {
            this.evenementsADéclencher = [];
        }
        if (!this.evenementsADéclencher.find(t => t === typeDHtmlEvent)) {
            this.evenementsADéclencher.push(typeDHtmlEvent);
        }
    }
    get déclencheClick(): boolean {
        return !!this.evenementsADéclencher && !!this.evenementsADéclencher.find(t => t === KfTypeDHTMLEvents.click);
    }
    get doitDéclencherFocusEtBlur(): boolean {
        return this.suitLeFocus || !!this.composant.gereTabIndexParent;
    }

    get estFocusable(): boolean {
        return this.doitDéclencherFocusEtBlur || KfdocumentContexte.suitLeFocus || (KfdocumentContexte.suitLeFocusFormEtClic
                        && (this.composant.estFormulaire || this.composant.estEntree
                            || this.composant.typeDeComposant === KfTypeDeComposant.radio
                            || this.déclencheClick));
    }

    // INITIALISATION
    initialiseHtml() {
        if (this.composant.titleHtml) {
            this.htmlElement.title = this.composant.titleHtml;
        }
        if (this.composant.gereTabIndex) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.keydown);
        }
        if (this.composant.gereTabIndexParent) {
            this.composant.gereTabIndexParent.initialise();
        }
        if (this.doitDéclencherFocusEtBlur) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.blur);
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.focus);
        }
    }

    // TABINDEX

    get tabIndex(): number {
        return this.htmlElement.tabIndex;
    }
    set tabIndex(tabIndex: number) {
        this.htmlElement.tabIndex = tabIndex;
    }

    // FOCUS
    prendLeFocus(): boolean {
        if (this.estFocusable) {
            this.htmlElement.focus();
            return true;
        }
        return false;
    }

    // DECLENCHEURS
    transformateur(htmlEventType: KfTypeDHTMLEvents): (event: Event) => KfEvenement {
        switch (htmlEventType) {
            case KfTypeDHTMLEvents.blur:
                return this.transformeBlur;
            case KfTypeDHTMLEvents.click:
                return this.transformeClick;
            case KfTypeDHTMLEvents.focus:
                return this.transformeFocus;
            case KfTypeDHTMLEvents.keydown:
                return this.transformeKeyDown;
            default:
                return this.transforme;
        }
    }

    transforme = (event: Event): KfEvenement => {
        return {
            emetteur: this.composant,
            type: KfTypeDEvenement.html,
            parametres: event,
            statut: KfStatutDEvenement.aTraiter
        };
    }
    transformeClick = (): KfEvenement => {
        let type: KfTypeDEvenement;
        const typeDeBouton = (this.composant as KfBouton).typeDeBouton;
        switch (typeDeBouton) {
            case KfTypeDeBouton.annuler:
            case KfTypeDeBouton.retablir:
                type = KfTypeDEvenement.retablit;
                break;
            case KfTypeDeBouton.soumettre:
                type = KfTypeDEvenement.soumet;
                break;
            default:
                type = KfTypeDEvenement.clic;
                break;
        }
        return {
            emetteur: this.composant,
            type: type,
            parametres: null,
            statut: KfStatutDEvenement.aTraiter
        };
    }
    transformeKeyDown = (event: Event): KfEvenement => {
        const keyEvent = event as KeyboardEvent;
        if (this.déclencheClick) {
            // enter ou space déclenchent un clic
            if (!keyEvent.altKey && !keyEvent.ctrlKey && !keyEvent.shiftKey
                && (keyEvent.key === KfKeyboardKey.enter || keyEvent.key === KfKeyboardKey.space)) {
                return this.transformeClick();
            }
        }
        return {
            emetteur: this.composant,
            type: KfTypeDEvenement.toucheBaissee,
            parametres: event,
            statut: KfStatutDEvenement.aTraiter
        };
    }
    transformeBlur = (): KfEvenement => {
        KfdocumentContexte.quandPerdFocus(this.composant);
        return {
            emetteur: this.composant,
            type: KfTypeDEvenement.focusPerdu,
            parametres: null,
            statut: KfStatutDEvenement.aTraiter
        };
    }
    transformeFocus = (): KfEvenement => {
        KfdocumentContexte.quandPrendFocus(this.composant);
        return {
            emetteur: this.composant,
            type: KfTypeDEvenement.focusPris,
            parametres: null,
            statut: KfStatutDEvenement.aTraiter
        };
    }

    // TRAITEMENT
    /**
     * ajoute une procédure de traitement
     * on peut ajouter autant de traitements qu'on veut pour le même type d'évènements
     * @param typeEvenement à traiter
     * @param traitement procédure qui traite ou non en fonction de son emetteur
     * @param info pour distinguer les traitements au déboguage
     */
    ajouteTraiteur(typeEvenement: KfTypeDEvenement, traitement: KfTraitementDEvenement, info?: any) {
        const t: KFTraiteurDEvenement = {
            type: typeEvenement,
            traitement: traitement,
            info: info
        };
        if (this.traiteurDEvenements) {
            this.traiteurDEvenements.push(t);
        } else {
            this.traiteurDEvenements = [t];
        }
    }

    /**
     *  à la sortie, evenement.fini est true si l'évènement a été traité
     */
    traite(evenement: KfEvenement) {
        if (this.traiteurDEvenements) {
            this.traiteurDEvenements.find(
                t => {
                    if (t.type === evenement.type) {
                        t.traitement(evenement);
                        if (evenement.statut !== KfStatutDEvenement.aTraiter) {
                            return true;
                        }
                    }
                }
            );
        }
    }

}
