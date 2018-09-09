import { AbstractControl, ValidatorFn, Validators, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { KfComposant } from './kf-composant';
import { KfEntrée } from './kf-entree';
import { KfListe } from '../kf-liste/kf-liste';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { isArray } from 'util';
import { KfValidateur, KfValidateurs } from '../kf-partages/kf-validateur';

export interface KfIComposantAvecValeur {
    composant: KfComposant;
    litValeur(): any;
    fixeValeur(valeur: any);
    estEgal(valeur: any);
    initialiseValeurEtControl();
    ajouteAValeur(valeurGroupeParent: any);
    ajouteAControls(controls: { [key: string]: AbstractControl; });
    // si racine
    initialise();
    rétablit(valeur: any);
}

export type KfComposantAvecValeur = KfEntrée | KfListe | KfGroupe;

export class KfComposantGereValeur {
    composant: KfComposantAvecValeur;

    /**
    * _valeur: any
    *
    *   seules les entrées et ? peuvent utiliser _valeur pour donner une valeur initiale au composant avant le passage par prépare()
    *
    *   seuls les composants éditables racine doivent définir _valeur
    *   ils le font avec la méthode initialise
    *
    *   la valeur d'un composant éditable racine qui a défini _valeur est: _valeur
    *   la valeur d'un composant éditable est indéfinie si sa racine n'a pas défini sa _valeur
    *   c'est: GroupeAvecValeur.valeur[composant.nom] si composant est le descendant d'un groupe avec valeur
    *
    */
    private _valeur: any;

    private _validateurs: KfValidateur[];
    /**
     * si vrai et si _validateurs, affiche un message expliquant pourquoi le composant est invalide
     */
    private _afficheErreur = true;

    /**
     * listes des noms d'erreur de validation à attribuer au composant
     */
    nomsErreurValidation: string[];

    /**
     * typeDeValeur: TypeDeValeur
     *  détermine si le KfComposant doit avoir un AbstractControl et de quel type
     *  détermine si le KfComposant doit avoir une valeur et de quel type
     *  est fixé par le constructeur des classes dérivées non abstraites
     *  est modifié pour un groupe dont les éléments sont sans valeur
     */
    typeDeValeur: KfTypeDeValeur;

    // INTERFACE
    /**
    * _abstractControl: AbstractControl
    *
    *   seuls les composants racine peuvent et doivent définir _abstractControl
    *   ils le font avec la méthode initialise
    *
    *   le control d'un composant racine qui a défini _abstractControl est: _abstractControl
    *   le controle d'un composant est indéfini si sa racine n'a pas défini sa _abstractControl
    *   c'est: GroupeAvecValeur.formGroup.controls[composant.nom] si composant est le descendant d'un groupe avec valeur
    *
    */
    _abstractControl: AbstractControl;

    // INITIALISATION

    /**
     * méthode récursive du reset d'un formulaire
     *
     * situation:
     *  quand on exécute FormGroup.reset(value) sur un FormGroup qui contient un FormArray,
     *  la valeur du FormArray n'est pas rétablie
     *
     * solution: utiliser KfComposant.rétablit(valeur)
     *
     * seuls les groupes et les listes définissent rétablit
     * les groupes exécutent rétablit pour faire exécuter rétablit aux listes
     * les listes pour créer leurs contenus à partir de leurs valeurs
     *  seuls les racines utilisent le paramètre valeur passé à rétablit
     *  les autres utilisent leur ValeurDansParent
     */

    editionEnCours: boolean;

    constructor(composant: KfComposantAvecValeur, typeDeValeur?: KfTypeDeValeur) {
        this.composant = composant;
        this.typeDeValeur = typeDeValeur ? typeDeValeur : KfTypeDeValeur.aucun;
    }

    // ACCES AUX MEMBRES

    get abstractControl(): AbstractControl {
        if (this.composant.estRacine) {
            return this._abstractControl;
        }
        const g = this.composant.groupeParent;
        if (g) {
            const ac = g.abstractControl as FormGroup;
            if (ac) {
                return ac.controls[this.composant.nom];
            }
        }
    }

    get valeur(): any {
        if (this.composant.estRacine) {
            return this._valeur;
        } else {
            if (this.composant.groupeParent.valeur) {
                return this.composant.groupeParent.valeur[this.composant.nom];
            }
        }
    }
    set valeur(valeur: any) {
        if (this.composant.estRacine) {
            this._valeur = valeur;
        } else {
            if (this.composant.groupeParent.valeur) {
                this.composant.groupeParent.valeur[this.composant.nom] = valeur;
            }
        }
    }
    estEgalA(valeur: any): boolean {
        let contenus: KfComposant[];
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                // si les champs sont dans un ordre différent, les JSON.stringify doivent avoir la même longueur
                if (JSON.stringify(this.valeur).length !== JSON.stringify(valeur).length) {
                    return false;
                }
                contenus = (this.composant as KfGroupe).contenus;
                for (let i = 0; i < contenus.length; i++) {
                    if (!contenus[i].gereValeur.estEgalA(valeur[contenus[i].nom])) {
                        return false;
                    }
                }
                return true;
            case KfTypeDeComposant.liste:
                contenus = (this.composant as KfListe).contenus;
                if (!isArray(valeur) || valeur.length !== contenus.length) {
                    return false;
                }
                for (let i = 0; i < contenus.length; i++) {
                    if (!contenus[i].gereValeur.estEgalA(valeur[i])) {
                        return false;
                    }
                }
                return true;
            default:
                return this._valeur === valeur;
        }
    }


    /* VALIDATION */
    get requis(): boolean {
        return this._validateurs && this._validateurs[0].validatorFn.name === Validators.required.name;
    }
    set requis(valeur: boolean) {
        if (!valeur && this.requis) {
            this._validateurs.shift();
        }
        if (valeur) {
            if (this._validateurs) {
                if (this._validateurs[0].validatorFn.name !== Validators.required.name) {
                    this._validateurs.unshift(KfValidateurs.required);
                }
            }
            this._validateurs = [KfValidateurs.required];
        }
    }

    AjouteValidateur(validateur: KfValidateur) {
        if (this._validateurs) {
            this._validateurs.push(validateur);
        } else {
            this._validateurs = [validateur];
        }
    }

    get Validateurs(): KfValidateur[] {
        return this._validateurs;
    }

    FixeValidateurs(validateurs: KfValidateur[]) {
        if (this._validateurs) {
            this._validateurs = this._validateurs.concat(validateurs);
        } else {
            this._validateurs = validateurs;
        }
        const control = this.abstractControl;
        if (control) {
            control.setValidators(this.validatorsFn);
        }
    }

    get validatorsFn(): ValidatorFn[] {
        return this._validateurs.filter(v => !!v.validatorFn).map(v => v.validatorFn);
    }

    distribueValidationErrors(erreursADistribuer: ValidationErrors): ValidationErrors {
        if (this.composant.estGroupe) {
            const groupe = this.composant as KfGroupe;
            groupe.contenus.forEach(
                c => {
                    if (c.gereValeur) {
                        erreursADistribuer = c.gereValeur.distribueValidationErrors(erreursADistribuer);
                    }
                }
            );
        }
        const erreurs: ValidationErrors = {};
        const mesErreurs: ValidationErrors = {};
        Object.keys(erreursADistribuer).forEach(
            key => {
                if (key === this.composant.nom || (this.nomsErreurValidation && this.nomsErreurValidation.includes(key))) {
                    mesErreurs[key] = erreursADistribuer[key];
                } else {
                    erreurs[key] = erreursADistribuer[key];
                }
            }
        );
        if (Object.keys(mesErreurs).length > 0) {
            if (this.abstractControl) {
                this.abstractControl.setErrors(mesErreurs);
                this.abstractControl.markAsDirty();
            }
        }
        return erreurs;
    }

    messages(errors: ValidationErrors): string[] {
        const messages: string[] = [];
        Object.keys(errors).forEach(
            key => {
                let validateur: KfValidateur;
                if (this.Validateurs) {
                    validateur = this.Validateurs.find(v => v.nom.toLowerCase() === key.toLowerCase());
                }
                if (validateur && validateur.message) {
                    messages.push(validateur.message);
                } else {
                    messages.push(errors[key]);
                }
            }
        );
        return messages;
    }

    get afficheErreur(): boolean {
        return this._afficheErreur;
    }
    set afficheErreur(valeur: boolean) {
        this._afficheErreur = valeur;
    }

    get erreurs(): string[] {
        const control = this.abstractControl;
        const invalide = control && !control.valid;
        if (!invalide) {
            // pas d'erreurs si pas de control ou si control est valide
            return [];
        }

        const messages: string[] = [];
        if (this.composant.estGroupe) {
            const groupe = this.composant as KfGroupe;
            groupe.contenus.forEach(composant => {
                const ctrl = composant.abstractControl;
                if (ctrl && !ctrl.valid) {
                    const msgs = composant.erreurs;
                    if (msgs.length === 1) {
                        messages.push(msgs[0]);
                    } else {
                        if (msgs.length > 1) {
                            messages.push((composant.texte ? composant.texte : composant.nom) + ' est invalide.');
                        }
                    }
                }
            });
        } else {
            const errors = this.composant.abstractControl.errors;
            Object.keys(errors).forEach(
                key => {
                    let validateur: KfValidateur;
                    if (this.Validateurs) {
                        validateur = this.Validateurs.find(v => v.nom.toLowerCase() === key.toLowerCase());
                    }
                    if (validateur) {
                        messages.push(validateur.message);
                    } else {
                        messages.push(errors[key]);
                    }
                }
            );
        }
        return messages;
    }

    // GROUPE

    créeValeurDesEnfants(groupe: KfGroupe): any {
        const valeur: any = {};
        groupe.noeud.Enfants.forEach(
            noeud => {
                const composant = noeud.objet as KfComposant;
                if (composant.gereValeur) {
                    composant.gereValeur.ajouteAValeur(valeur);
                }
            }
        );
        if (Object.keys(valeur).length > 0) {
            groupe.gereValeur.typeDeValeur = KfTypeDeValeur.avecGroupe;
            return valeur;
        } else {
            groupe.gereValeur = null;
            return null;
        }
    }

    créeFormGroupDesEnfants(groupe: KfGroupe): FormGroup {
        const controls: { [key: string]: AbstractControl } = {};
        groupe.noeud.Enfants.forEach(noeud => {
            const composant = noeud.objet as KfComposant;
            if (composant.gereValeur) {
                composant.gereValeur.ajouteAControls(controls);
            }
        });
        if (this._validateurs) {
            return new FormGroup(controls, this._validateurs.map(v => v.validatorFn));
        } else {
            return new FormGroup(controls);
        }
    }

    // INITIALISATION
    /** */
    prépare() {
        if (!this.composant.estRacine) {
            return;
        }
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                const groupe = this.composant as KfGroupe;
                this._valeur = this.créeValeurDesEnfants(groupe);
                this._abstractControl = this.créeFormGroupDesEnfants(groupe);
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                this._valeur = [];
                this._abstractControl = new FormArray([]);
                break;
            default:
                const entrée = this.composant as KfEntrée;
                if (this._valeur !== undefined) {
                    this._valeur = null;
                }
                this._abstractControl = new FormControl();
                this._abstractControl.setValue(this._valeur);
                break;
        }
        this._abstractControl.setValue(this._valeur);
        if (this._validateurs) {
            this.abstractControl.setValidators(this.validatorsFn);
        }
    }

    ajouteAValeur(valeurGroupeParent: any) {
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                const groupe = this.composant as KfGroupe;
                if (groupe.estConteneurSansValeur) {
                    groupe.noeud.Enfants.forEach(
                        noeud => {
                            const composant = noeud.objet as KfComposant;
                            if (composant.gereValeur) {
                                composant.gereValeur.ajouteAValeur(valeurGroupeParent);
                            }
                        }
                    );
                } else {
                    const valeur = this.créeValeurDesEnfants(groupe);
                    if (valeur) {
                        valeurGroupeParent[groupe.nom] = valeur;
                    }
                }
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                valeurGroupeParent[liste.nom] = [];
                break;
            default:
                const entrée = this.composant as KfEntrée;
                valeurGroupeParent[entrée.nom] = entrée._valeur === undefined ? null : entrée._valeur;
                break;
        }
    }

    ajouteAControls(controls: { [key: string]: AbstractControl; }) {
        let abstractControl: AbstractControl;
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                const groupe = this.composant as KfGroupe;
                if (groupe.estConteneurSansValeur) {
                    groupe.noeud.Enfants.forEach(noeud => {
                        const composant = noeud.objet as KfComposant;
                        if (composant.gereValeur) {
                            composant.gereValeur.ajouteAControls(controls);
                        }
                    });
                } else {
                    abstractControl = this.créeFormGroupDesEnfants(groupe);
                }
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                abstractControl = new FormArray([]);
                break;
            default:
                const entrée = this.composant as KfEntrée;
                abstractControl = new FormControl();
                abstractControl.setValue(this._valeur);
                break;
        }
        if (this._validateurs) {
            abstractControl.setValidators(this.validatorsFn);
        }
        controls[this.composant.nom] = abstractControl;
    }

    rétablit(valeur: any) {
        if (!this.composant.estRacine) {
            return;
        }
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                const groupe = this.composant as KfGroupe;
                this._valeur = valeur;
                this.recréeListes(groupe, valeur);
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                liste.remplit(liste.creeItems.recréeItems(valeur));
                break;
            default:
                const entrée = this.composant as KfEntrée;
                this._valeur = valeur;
                break;
        }
        this._abstractControl.reset(this._valeur);
    }

    private recréeListes(groupe: KfGroupe, valeur: any) {
        groupe.noeud.Enfants.forEach(noeud => {
            const composant = noeud.objet as KfComposant;
            switch (composant.typeDeComposant) {
                case KfTypeDeComposant.groupe:
                    if (composant.gereValeur) {
                        this.recréeListes(composant as KfGroupe, valeur[composant.nom]);
                    }
                    break;
                case KfTypeDeComposant.liste:
                    const liste = composant as KfListe;
                    liste.remplit(liste.creeItems.recréeItems(valeur[composant.nom]));
                    break;
                default:
                    break;
            }
        });
    }

    // MISE A JOUR
    /** mise à jour de _valeur quand _abstractControl.value change */
    traiteValueChange() {
        this._valeur = this._abstractControl.value;
        this._abstractControl.markAsPristine();
    }

    depuisControl() {
        this._valeur = this._abstractControl.value;
    }

    versControl() {
        this.rétablit(this._valeur);
    }

}

