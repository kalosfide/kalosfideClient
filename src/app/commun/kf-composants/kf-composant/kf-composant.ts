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
import { KfTexteImage } from '../kf-partages/kf-texte-image/kf-texte-image';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfValidateur } from '../kf-partages/kf-validateur';
import { KfTexteDef, ValeurTexteDef } from '../kf-partages/kf-texte-def';
import { KfClasseDefs } from '../kf-partages/kf-classe-def';
import { KfImageDef } from '../kf-partages/kf-image-def/kf-image-def';
import { ValeurNombreDef, KfNombreDef } from '../kf-partages/kf-nombre-def';

export interface IKfComposant {
    composant: KfComposant;
}
export abstract class KfComposant implements IKfComposant {
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
    enligne: boolean;
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
    /**
     * estRacineV: si vrai, à fixer avant quandTousAjoutés
     */
    get estRacineV(): boolean {
        return this.gereValeur && this.gereValeur.estRacineV;
    }
    set estRacineV(valeur: boolean) {
        if (this.gereValeur) {
            this.gereValeur.estRacineV = valeur;
        }
    }

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
     * _classeDefs: KfClasseDef[]
     *  classes css à appliquer
     */
    private _classeDefs: KfClasseDefs;

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
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
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

    get composant(): KfComposant {
        return this;
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

    ajoute(composant: KfComposant) {
        this.noeud.Ajoute(composant.noeud);
    }

    get contenus(): KfComposant[] {
        return this.enfants;
    }

    contenu(nom: string): KfComposant {
        return this.contenus.find(c => c.nom === nom);
    }

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
        return this.estRacineV && this.typeDeComposant === KfTypeDeComposant.groupe;
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
    trouveClasse(classe: string): KfTexteDef {
        return this._classeDefs.trouveClasse(classe);
    }
    ajouteClasseDef(...classeDefs: KfTexteDef[]) {
        if (!this._classeDefs) {
            this._classeDefs = new KfClasseDefs();
        }
        this._classeDefs.ajouteClasseDef(classeDefs);
    }
    supprimeClasseDef(...classeDefs: KfTexteDef[]) {
        this._classeDefs.supprimeClasseDef(classeDefs);
    }

    get classes(): string[] {
        const classes = this._classeDefs ? this._classeDefs.classes : [];
        return classes;
    }

    get classe(): string {
        return ' ' + this.classes.join(' ');
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
     * l'un au moins est attendu
     */
    fixeTexteUrlImage(texte?: KfTexteDef, imageAvant?: KfTexteDef, imageApres?: KfTexteDef) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(texte, imageAvant, imageApres);
        } else {
            this.texteImage.fixeTexte(texte);
        }
    }
    /**
     * fixe le texte de l'element ou de son label (facultatif)
     */
    fixeTexte(texte: KfTexteDef) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(texte);
        } else {
            this.texteImage.fixeTexte(texte);
        }
    }
    /**
     * retourne l'image avant le texte de l'element ou de son label (facultatif)
     */
    get imageAvant(): KfImageDef {
        if (this.texteImage) {
            return this.texteImage.imageAvant;
        }
    }
    /**
     * fixe l'image avant le texte de l'element ou de son label (facultatif)
     */
    fixeUrlImageAvant(url: KfTexteDef) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(null, url);
        } else {
            this.texteImage.fixeUrlImageAvant(url);
        }
    }
    fixeDimensionsImageAvant(largeur?: KfNombreDef, hauteur?: KfNombreDef) {
        if (this.texteImage) {
            this.texteImage.fixeDimensionsImageAvant(largeur, hauteur);
        }
    }
    /**
     * retourne l'image après le texte de l'element ou de son label (facultatif)
     */
    get imageApres(): KfImageDef {
        if (this.texteImage) {
            return this.texteImage.imageApres;
        }
    }
    /**
     * fixe l'image après le texte de l'element ou de son label (facultatif)
     */
    fixeUrlImageApres(url: KfTexteDef) {
        if (!this.texteImage) {
            this.texteImage = new KfTexteImage(null, null, url);
        } else {
            this.texteImage.fixeUrlImageApres(url);
        }
    }
    fixeDimensionsImageApres(largeur?: KfNombreDef, hauteur?: KfNombreDef) {
        if (this.texteImage) {
            this.texteImage.fixeDimensionsImageApres(largeur, hauteur);
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

    // avec disposition
    ajouteAValeur(parentV: KfComposant) {
        parentV.gereValeur.ajoute(this.gereValeur);
    }

}
