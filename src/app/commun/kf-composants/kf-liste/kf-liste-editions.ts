import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfListe } from './kf-liste';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement, KfTraitementDEvenement } from '../kf-partages/kf-evenements';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeBouton, KfTypeDeBaliseDEtiquette, KfTypeDeComposant } from '../kf-composants-types';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfParametres } from '../kf-composants-parametres';
import { KfListeEditeur } from './kf-liste-editeur';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfDialogueDef } from '../kf-dialogue/kf-dialogue-def';
import { KfListeMiseAJour } from './kf-liste-mise-a-jour';
import { KfTexteDef, ValeurTexteDef } from '../kf-partages/kf-texte-def';

export interface KfListeEditionsInterface {
    /**
     * si défini, une KfEtiquette sera ajoutée
     */
    titreListe?: {
        texte?: string;
        balise?: KfTypeDeBaliseDEtiquette;
    };
    /**
     * texte à afficher quand la liste est vide
     */
    listeVide?: {
        texte?: string;
        balise?: KfTypeDeBaliseDEtiquette;
    };
    /**
     * texte à afficher quand aucun item n'est sélectionné
     */
    rienAEditer?: {
        texte?: string;
        balise?: KfTypeDeBaliseDEtiquette;
    };
    /**
     * permet de proposer des aides à l'édition (ex.: choix prédéfinis à modifier)
     */
    enTete?: {
        /** KfComposant ayant créé valeur et control */
        composant?: KfComposant;
        /** pour signaler à l'item edité les évènements de l'en-tête */
        quandEvenement?: (item: object, evenement: KfEvenement) => void;
    };
    /**
     * si défini, une KfEtiquette sera ajoutée à l'édition de l'item
     */
    titreItem?: {
        texte?: KfTexteDef;
        balise?: KfTypeDeBaliseDEtiquette;
        /** si true, le titre précédera l'en-tête */
        avantEnTete?: boolean;
    };
    /**
     * si défini l'édition se fera dans un dialogue asynchrone et les champs suivants sont ignorés
     */
    dialogueDef?: () => KfDialogueDef;
    /**
     * si defini, l'édition se fera dans une table et les champs suivants sont ignorés
     * il doit y avoir autant de champs (sans étiquette) que de colonnes.
     */
    dansTable?: {
        /** si vrai, l'id des items sera affichée dans la première colonne */
        avecColonneId?: boolean;
        /** si défini, titres des en-têtes des colonnes */
        titresDesColonnes?: string[];
    };
    /**
     * valeur par défaut: KfListeMiseAJour.immediate
     */
    typeDeMiseAJour?: KfListeMiseAJour;
    /**
     * si defini, des boutons Ok et Annuler seront ajoutés lors de l'édition d'un élément
     */
    avecOkAnnuler?: {
        /** texte du bouton Ok */
        texteOk?: string;
        /** texte du bouton Annuler */
        texteAnnuler?: string;
    };
}

export class KfListeEditions {

    /**
     * parent du gestionnaire
     */
    liste: KfListe;
    /**
     * si défini, une KfEtiquette sera ajoutée
     */
    etiquetteTitreListe: KfEtiquette;
    /**
     * etiquette à afficher quand la liste est vide
     */
    etiquetteListeVide: KfEtiquette;
    /**
     * etiquette à afficher quand aucun item n'est sélectionné
     */
    etiquetteRienAEditer: KfEtiquette;
    /**
     * permet de proposer des aides à l'édition (ex.: choix prédéfinis à modifier)
     */
    enTete: KfComposant;
    /**
     * pour signaler à l'item edité les évènements de l'en-te^te
     */
    private _quandEvenementEnTete: (item: object, evenement: KfEvenement) => void;
    /**
     * si défini, une KfEtiquette sera ajoutée
     */
    titre: (item: object) => string;
    etiquetteTitre: (item: object) => KfEtiquette;
    /**
     * si true, le titre précédera le sélecteur
     */
    private _titreAvantEnTete: boolean;
    /**
     * bouton Ok montré lors de l'édition d'un élément à ajouter
     */
    boutonOk: KfBouton;
    /**
     * bouton Annuler montré lors de l'édition d'un élément à ajouter
     */
    boutonAnnuler: KfBouton;
    /**
     * item édité avant d'être ajouté à la liste
     */
    itemNouveau: object;
    /**
     * item qui était choisi avant l'édition d'itemNouveau
     */
    itemAvantNouveau: object;
    /**
     * édition séparée
     */
    editeur: KfListeEditeur;
    typeDeMiseAJour: KfListeMiseAJour;

    /** avec dialogue */
    dialogueDef: () => KfDialogueDef;

    /** si definis, l'édition se fera dans une table */
    dansTable: {
        enTetesDesColonnes?: KfGroupe;
        avecColonneId: boolean;
    };

    constructor(liste: KfListe, inter: KfListeEditionsInterface) {
        this.liste = liste;
        const parDefaut = KfParametres.listeParDefaut;
        if (inter.titreListe) {
            this.etiquetteTitreListe = new KfEtiquette('', inter.titreListe.texte || parDefaut.texteEtiquetteTitre);
            this.etiquetteTitreListe.baliseHTML = inter.titreListe.balise || KfTypeDeBaliseDEtiquette.P;
        }
        if (inter.listeVide) {
            this.etiquetteListeVide = new KfEtiquette('', inter.listeVide.texte || parDefaut.texteListeVide);
            this.etiquetteListeVide.baliseHTML = inter.listeVide.balise || KfTypeDeBaliseDEtiquette.P;
        }
        if (inter.rienAEditer) {
            this.etiquetteRienAEditer = new KfEtiquette('', inter.rienAEditer.texte || parDefaut.texteRienAEditer);
            this.etiquetteRienAEditer.baliseHTML = inter.rienAEditer.balise || KfTypeDeBaliseDEtiquette.P;
        }
        this.enTete = inter.enTete.composant;
        this._quandEvenementEnTete = inter.enTete.quandEvenement;
        if (inter.titreItem) {
            this._titreAvantEnTete = inter.titreItem.avantEnTete;
            this.titre = (item: object) => {
                if (inter.titreItem.texte) {
                    return ValeurTexteDef(inter.titreItem.texte);
                } else {
                    if (this.liste.selecteurs) {
                        if (item === this.itemNouveau) {
                            return this.liste.selecteurs.texte(null);
                        } else {
                            return this.liste.selecteurs.texte(item);
                        }
                    } else {
                        return this.liste.creeItems.composant(item).nom;
                    }
                }
            };
            this.etiquetteTitre = (item: object) => {
                const e = new KfEtiquette('titre', item ? this.titre(item) : '');
                e.baliseHTML = inter.titreItem.balise;
                return e;
            };
        }
        if (inter.dialogueDef) {
            this.typeDeMiseAJour = KfListeMiseAJour.parBoiteDeDialogue;
            this.dialogueDef = inter.dialogueDef;
            return;
        }
        if (inter.dansTable) {
            this.typeDeMiseAJour = KfListeMiseAJour.immédiate;
            this.dansTable = {
                avecColonneId: inter.dansTable.avecColonneId,
            };
            if (inter.dansTable.titresDesColonnes) {
                const enTetesDesColonnes = new KfGroupe('');
                enTetesDesColonnes.ajouteClasseDef('kf-row');
                let nbColonnes = 0;
                const etiquettesDesColonnes = inter.dansTable.titresDesColonnes.map(
                    (t: string) => {
                        const e = new KfEtiquette('c' + ++nbColonnes, t);
                        e.ajouteClasseDef('kf-cell');
                        enTetesDesColonnes.ajoute(e);
                    }
                );
                if (nbColonnes > 0) {
                    this.dansTable.enTetesDesColonnes = enTetesDesColonnes;
                }
            }
        } else {
            this.typeDeMiseAJour = inter.typeDeMiseAJour ? inter.typeDeMiseAJour : KfListeMiseAJour.immédiate;
        }
        if (this.typeDeMiseAJour !== KfListeMiseAJour.immédiate) {
            this.boutonOk = new KfBouton('', inter.avecOkAnnuler.texteOk || parDefaut.texteOk);
            this.boutonOk.inactivitéFnc = () => {
                let item: object;
                switch (this.typeDeMiseAJour) {
                    case KfListeMiseAJour.immédiateSaufPourAjout:
                        item = this.itemNouveau;
                        break;
                    case KfListeMiseAJour.parOkAnnuler:
                        item = this.itemNouveau ? this.itemNouveau : this.liste.itemChoisi;
                        break;
                    case KfListeMiseAJour.parEditeurSéparé:
                        item = this.editeur.itemEdité;
                        break;
                }
                if (item) {
                    const gereValeur = this.liste.creeItems.gereValeur(item);
                    return gereValeur.abstractControl.pristine || !gereValeur.abstractControl.valid;
                }
            };
            this.boutonAnnuler = new KfBouton('', inter.avecOkAnnuler.texteAnnuler || parDefaut.texteAnnuler);
            const visibiliteFnc = () => {
                return this.typeDeMiseAJour === KfListeMiseAJour.parOkAnnuler
                    || (this.typeDeMiseAJour === KfListeMiseAJour.immédiateSaufPourAjout && this.ajoutEnCours)
                    || (this.typeDeMiseAJour === KfListeMiseAJour.parEditeurSéparé && this.editeur.editionEnCours);
            };
            this.boutonOk.visibiliteFnc = visibiliteFnc;
            this.boutonAnnuler.visibiliteFnc = visibiliteFnc;
        }
        if (this.typeDeMiseAJour === KfListeMiseAJour.parEditeurSéparé) {
            this.editeur = new KfListeEditeur(this);
        } else {
            if (this.typeDeMiseAJour !== KfListeMiseAJour.immédiate) {
                this.boutonOk.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, this.traiteOk);
                this.boutonAnnuler.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, this.traiteAnnuler);
                this.itemNouveau = this.liste.creeItems.creeItem();
            }
        }
    }

    quandEvenementEnTete(item: object, evenement: KfEvenement) {
        if (this._quandEvenementEnTete) {
            this._quandEvenementEnTete(item, evenement);
        }
        evenement.statut = KfStatutDEvenement.fini;
    }

    get rienAEditer(): boolean {
        console.log(this);
        return this.liste.liste.Nb > 0 && !this.liste.itemChoisi && !this.itemNouveau;
    }

    get listeVide(): boolean {
        return this.liste.liste.Nb === 0;
    }

    get titreAvantEnTete(): boolean {
        return !!this.etiquetteTitre && (this._titreAvantEnTete || !this.enTete);
    }

    get titreApresEnTete(): boolean {
        return !!this.etiquetteTitre && !this._titreAvantEnTete && !!this.enTete;
    }

    edition(item: object): KfComposant {
        return this.liste.creeItems.composant(item);
    }

    get ajoutEnCours(): boolean {
        return !!this.itemNouveau;
    }

    get editionEnCours(): boolean {
        return this.editeur && this.editeur.editionEnCours;
    }

    get editionEnCoursFnc(): (() => boolean) {
        return () => this.editeur && this.editeur.editionEnCours;
    }

    initialise() {
        /* cache les boutons */
        if (this.boutonAnnuler) {
            this.boutonOk.visibilite = false;
            this.boutonAnnuler.visibilite = false;
        }
        this.itemAvantNouveau = null;
        this.itemNouveau = null;
    }

    initialiseAjout() {
        if (this.boutonAnnuler) {
            this.boutonOk.visibilite = false;
            this.boutonAnnuler.visibilite = false;
        }
        this.itemAvantNouveau = null;
        this.itemNouveau = null;
    }

    gereAjout(): boolean {
        if (this.typeDeMiseAJour !== KfListeMiseAJour.immédiate) {
            this.itemAvantNouveau = this.liste.itemChoisi;
            this.itemNouveau = this.liste.creeItems.creeItem();
            this.liste.fixeChoisi(null);
            this.boutonOk.visibilite = true;
            this.boutonAnnuler.visibilite = true;
            if (this.editeur) {
                this.editeur.activeEdition();
            }
            return true;
        }
    }

    /**
     * prépare un item et son contenu avant son ajout à la liste
     */
    préparePourAjout(item: object) {
        const composant = this.liste.creeItems.composant(item);
        if (this.dansTable && composant.typeDeComposant === KfTypeDeComposant.groupe) {
            const g = composant as KfGroupe;
            g.ajouteClasseDef('kf-row');
            g.contenus.forEach(c => c.ajouteClasseDef('kf-cell'));
        }
    }

    traiteOk: KfTraitementDEvenement = (evenement: KfEvenement): void => {
        this.liste.ajoute(this.itemNouveau);
        this.liste.quandListeChange();
        this.initialiseAjout();
    }

    traiteAnnuler: KfTraitementDEvenement = (evenement: KfEvenement): void => {
        const itemAvantNouveau = this.itemAvantNouveau;
        this.initialiseAjout();
        this.liste.fixeChoisi(itemAvantNouveau);
    }

}
