/**
 * class KfComposant
 *
 *  Les KfComposants sont des précurseurs d'Angular components. Prééxistants aux components, ils créent les objets
 *  necessaires avant d'être injectés dans leur component avec @Input
 *
 * structure:
 *  les KfComposants sont les noeuds d'un arbre.
 *  KfConteneur: KfComposant qui a des enfants
 *
 * components:
 *
 */
import { AbstractControl } from '@angular/forms';

import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { Noeud } from '../../outils/arbre/noeud';
import { KfListe } from '../kf-liste/kf-liste';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfBaliseConteneur } from '../kf-partages/kf-balises-html';
import { KfComposantGereHtml } from './kf-composant-gere-html';
import { KfComposantGereVisible } from './kf-composant-gere-visible';
import { KfGereTabIndex } from './kf-composant-gere-tabindex';
import { KfTexteImage } from '../kf-partages/kf-texte-image';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfValidateur } from '../kf-partages/kf-validateur';

export abstract class KfComposant {
    // GENERAL
    /**
     * nom: string
     *  requis:
     *      pour lier le KfComposant à son AbstractControl
     *      pour lier le KfComposant à sa valeur
     *      pour trouver un KfComposant enfant ou descendant
     */
    nom: string;

    /**
     * typeDeComposant: TypeDeComposant
     *  détermine quel Angular component doit afficher ce KfComposant
     *  est fixé par le constructeur des classes dérivées non abstraites
     */
    typeDeComposant: KfTypeDeComposant;

    // STRUCTURE
    /**
     *  les KfComposants sont les noeuds d'un arbre.
     */
    noeud: Noeud;
    /**
     * listeParent: Liste
     *  lorsqu'un composant est destiné à une liste, il faut renseigner ce champ
     */
    listeParent: KfListe;

    // VALEUR
    /**
    * _valeur: any
    *
    *   seuls les composants éditables racine doivent définir _valeur
    *   ils le font avec la méthode initialise
    *
    *   la valeur d'un composant éditable racine qui a défini _valeur est: _valeur
    *   la valeur d'un composant éditable est indéfinie si sa racine n'a pas défini sa _valeur
    *   c'est: GroupeAvecValeur.valeur[composant.nom] si composant est le descendant d'un groupe avec valeur
    *
    */
    gereValeur: KfComposantGereValeur;

    // HTML

    /**
     * pour diminuer la taille de ce fichier, les éléments HTML du template et leurs évènements sont gérés
     * dans un objetspécialisé
     */
    gereHtml: KfComposantGereHtml;

    /**
     * pour diminuer la taille de ce fichier, tabIndex et focus et leurs évènements sont gérés
     * dans un objetspécialisé
     */
    gereTabIndex: KfGereTabIndex;

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     */
    balisesAAjouter: KfBaliseConteneur[];

    /**
     * _classes: string[]
     *  classes css à appliquer
     */
    private _classes: (string | ((composant: KfComposant) => string))[] = [];

    /**
     * KfTexteImage de l'element ou de son label (facultatif)
     */
    texteImage: KfTexteImage;

    /**
     * title de l'element
     */
    private _titleHtml: string;

    /**
     * voir visible
     */
    gereVisible: KfComposantGereVisible;

    /**
     * voir inactif
     */
    private _inactivité: boolean;
    private _inactivitéFnc: () => boolean;

    constructor(nom: string,
        typeDeComposant: KfTypeDeComposant,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        this.nom = nom;
        this.typeDeComposant = typeDeComposant;
        if (texte || imageAvant || imageApres) {
            this.texteImage = new KfTexteImage(texte, imageAvant, imageApres);
        }
        this.noeud = new Noeud;
        this.noeud.objet = this;
        this.gereVisible = new KfComposantGereVisible(this);
        this.gereHtml = new KfComposantGereHtml(this);
    }
    /**
     * typeDeValeur: TypeDeValeur
     *  détermine si le KfComposant doit avoir un AbstractControl et de quel type
     *  détermine si le KfComposant doit avoir une valeur et de quel type
     *  est fixé par le constructeur des classes dérivées non abstraites
     *  est modifié pour un groupe dont les éléments sont sans valeur
     */
    get typeDeValeur(): KfTypeDeValeur {
        return this.gereValeur ? this.gereValeur.typeDeValeur : KfTypeDeValeur.aucun;
    }

    // STRUCTURE
    get parent(): KfComposant {
        if (this.noeud.parent) {
            return <KfComposant>this.noeud.parent.objet;
        } else {
            return null;
        }
    }
    get racine(): KfComposant {
        return this.noeud.racine.objet as KfComposant;
    }

    get estDansListe(): boolean {
        return !!(this.listeParent);
    }

    ascendantVérifiant(vérifie: (c: KfComposant) => boolean): KfComposant {
        let p = this.parent;
        while (p) {
            if (vérifie(p)) {
                return p;
            }
            p = p.parent;
        }
        return null;
    }

    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    get groupeParent(): KfGroupe {
        return this.ascendantVérifiant((c: KfComposant) => c.typeDeValeur === KfTypeDeValeur.avecGroupe) as KfGroupe;
    }

    get formulaireParent(): KfSuperGroupe {
        const gp = this.groupeParent;
        if (gp) {
            return gp.noeud.racine.objet as KfSuperGroupe;
        }
    }

    abstract ajoute(composant: KfComposant);

    get enfants(): KfComposant[] {
        return this.noeud.ObjetsEnfants().map<KfComposant>(objet => <KfComposant>objet);
    }

    enfant(nom: string): KfComposant {
        return this.enfants.find(
            e => e.nom === nom
        );
    }

    descendantDeNom(nom: string): KfComposant {
        const trouvé = this.noeud.Trouve(
            (n: Noeud) => (n.objet as KfComposant).nom === nom
        );
        return (trouvé.length > 0) ? trouvé[0] as KfComposant : null;
    }

    descendantDeTypeDeValeur(typeDeValeur: KfTypeDeValeur): KfComposant {
        let trouvé = null;
        trouvé = this.noeud.Trouve(
            (n: Noeud) => (n.objet as KfComposant).typeDeValeur === typeDeValeur
        );
        return (trouvé) ? trouvé as KfComposant : null;
    }

    // INFO
    get estRacine(): boolean {
        return !(this.noeud.parent);
    }
    get estFormulaire(): boolean {
        return this.estRacine && this.typeDeComposant === KfTypeDeComposant.groupe && this.typeDeValeur === KfTypeDeValeur.avecGroupe;
    }
    get estGroupe(): boolean {
        return this.typeDeComposant === KfTypeDeComposant.groupe;
    }
    get estListe(): boolean {
        return this.typeDeComposant === KfTypeDeComposant.liste;
    }
    get estElement(): boolean {
        return !this.estGroupe && !this.estListe;
    }
    get estEntree(): boolean {
        return this.estElement && this.typeDeValeur !== KfTypeDeValeur.aucun;
    }

    get estDansFormulaire(): boolean {
        return this.estFormulaire || (this.noeud.parent && this.parent.estDansFormulaire);
    }

    // VALEUR

    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    get valeurDansParent(): any {
        if (this.groupeParent) {
            const v = this.groupeParent.valeurDansParent;
            if (v) {
                return v[this.nom];
            }
        }
    }
    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    set valeurDansParent(valeur: any) {
        if (this.groupeParent) {
            const v = this.groupeParent.valeurDansParent;
            if (v) {
                v[this.nom] = valeur;
            }
        }
    }

    /* VALIDATION */

    get requis(): boolean {
        if (this.gereValeur) {
            return this.gereValeur.requis;
        }
    }
    set requis(requis: boolean) {
        this.gereValeur.requis = requis;
    }

    AjouteValidateur(validateur: KfValidateur) {
        if (this.gereValeur) {
            this.gereValeur.AjouteValidateur(validateur);
        }
    }

    get afficheErreur(): boolean {
        return this.gereValeur && this.gereValeur.afficheErreur;
    }
    set afficheErreur(valeur: boolean) {
        if (this.gereValeur) {
            this.gereValeur.afficheErreur = valeur;
        }
    }

    get erreurs(): string[] {
        if (this.gereValeur) {
            return this.gereValeur.erreurs;
        }
    }

    // INTERFACE

    get abstractControl(): AbstractControl {
        if (this.gereValeur) {
            return this.gereValeur.abstractControl;
        }
    }

    active() {
        this._inactivité = false;
        if (this.abstractControl) {
            this.abstractControl.enable();
        }
    }
    désactive() {
        console.log('désactive', this.nom);
        this._inactivité = true;
        if (this.abstractControl) {
            this.abstractControl.disable();
        }
    }

    /**
     *  méthodes pour fixer la façon de déterminer la visibilité
     */
    set visibilite(visibilite: boolean) {
        this.gereVisible.visibilite = visibilite;
    }
    set visibiliteFnc(visibiliteFnc: () => boolean) {
        this.gereVisible.visibiliteFnc = visibiliteFnc;
    }
    /**
     * visible: boolean
     *  utilisé par l'Angular component parent pour affecter ou non la classe css kf-invisible au template du composant
     */
    get visible(): boolean {
        return this.gereVisible.visible;
    }

    /**
     *  méthodes pour fixer la façon de déterminer l'activité
     */
    set inactivité(inactivité: boolean) {
        this._inactivité = inactivité;
    }
    set inactivitéFnc(inactivitéFnc: () => boolean) {
        this._inactivitéFnc = inactivitéFnc;
    }
    /**
     * permet d'affecter l'attribut disabled au DOM element
     */
    get inactif(): boolean {
        let inactif = (this._inactivitéFnc) ? this._inactivitéFnc() : this._inactivité;
        inactif = (this.abstractControl && this.abstractControl.disabled)
            || (this.parent && this.parent.inactif)
            || (this.listeParent && this.listeParent.inactif)
            || inactif;
        return inactif;
    }


    // HTML

    get tabIndex(): number {
        return this.gereHtml.tabIndex;
    }
    set tabIndex(tabIndex: number) {
        this.gereHtml.tabIndex = tabIndex;
    }

    get parentPourTabIndex(): KfComposant {
        let parent = this.listeParent ? this.listeParent : this.parent;
        if (parent) {
            if (!parent.gereTabIndex) {
                parent = parent.parentPourTabIndex;
            }
        }
        return parent;
    }
    get gereTabIndexParent(): KfGereTabIndex {
        const parent = this.parentPourTabIndex;
        if (parent && parent.gereTabIndex.contenus.find(c => c === this)) {
            return parent.gereTabIndex;
        }
    }

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     */

    prendLeFocus(): boolean {
        if (this.gereHtml.prendLeFocus()) {
            return true;
        }
        if (this.gereTabIndex) {
            return this.gereTabIndex.prendLeFocus();
        }
    }

    // CSS
    ajouteClasse(...classes: (string | ((composant: KfComposant) => string))[]) {
        classes.forEach(
            classe => {
                if (!this._classes.find(c => classe === c)) {
                    this._classes.push(classe);
                }
            }
        );
    }
    supprimeClasse(...classes: (string | ((composant: KfComposant) => string))[]) {
        const _classes = this._classes;
        this._classes = [];
        _classes.forEach(
            classe => {
                if (!classes.find(c => classe === c)) {
                    this._classes.push(classe);
                }
            }
        );
    }

    get classe(): string {
        const classes: string[] = [];
        this._classes.forEach(
            c => {
                const classe = typeof (c) === 'string' ? c : c(this);
                if (classe) {
                    classes.push(classe);
                }
            });
        if (!this.visible) {
            classes.push('invisible');
        }
        return ' ' + classes.join(' ');
    }

    /**
     * retourne le texte de l'element ou de son label (facultatif)
     */
    get texte(): string {
        if (this.texteImage) {
            return this.texteImage.texte;
        }
    }
    /**
     * fixe le texte de l'element ou de son label (facultatif)
     */
    fixeTexte(texte: string | (() => string)) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(texte);
        } else {
            this.texteImage.fixeTexte(texte);
        }
    }
    /**
     * retourne l'image avant le texte de l'element ou de son label (facultatif)
     */
    get imageAvant(): string {
        if (this.texteImage) {
            return this.texteImage.imageAvant;
        }
    }
    /**
     * fixe l'image avant le texte de l'element ou de son label (facultatif)
     */
    fixeImageAvant(imageAvant: string | (() => string)) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(null, imageAvant);
        } else {
            this.texteImage.fixeImageAvant(imageAvant);
        }
    }
    /**
     * retourne l'image après le texte de l'element ou de son label (facultatif)
     */
    get imageApres(): string {
        if (this.texteImage) {
            return this.texteImage.imageApres;
        }
    }
    /**
     * fixe l'image après le texte de l'element ou de son label (facultatif)
     */
    fixeImageApres(imageApres: string | (() => string)) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(null, null, imageApres);
        } else {
            this.texteImage.fixeImageApres(imageApres);
        }
    }

    /**
     * title de l'element
     */
    get titleHtml(): string {
        return this._titleHtml;
    }
    set titleHtml(titleHtml: string) {
        this._titleHtml = titleHtml;
        if (this.gereHtml.htmlElement) {
            this.gereHtml.htmlElement.title = titleHtml;
        }
    }

}
