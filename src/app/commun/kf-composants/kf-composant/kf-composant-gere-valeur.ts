import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { KfComposant } from './kf-composant';
import { KfEntrée } from './kf-entree';
import { KfListe } from '../kf-liste/kf-liste';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfValidateur } from '../kf-partages/kf-validateur';
import { KfVueTable, IKfVueTable } from '../kf-vue-table/kf-vue-table';
import { Noeud } from '../../outils/arbre/noeud';

export type KfComposantAvecValeur = KfEntrée | KfListe | KfGroupe | IKfVueTable;

export class KfComposantGereValeur {
    icomposant: KfComposantAvecValeur;
    composant: KfComposant;
    noeudV: Noeud; // disposition
    estRacineV: boolean;

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

    constructor(composant: KfComposantAvecValeur, typeDeValeur?: KfTypeDeValeur) {
        this.icomposant = composant;
        this.composant = composant.composant;
        this.typeDeValeur = typeDeValeur ? typeDeValeur : KfTypeDeValeur.aucun;
        this.noeudV = new Noeud();
        this.noeudV.objet = this;
    }

    // avec disposition
    ajoute(gereValeur: KfComposantGereValeur) {
        if (this.composant.typeDeComposant === KfTypeDeComposant.groupe) {
            this.noeudV.Ajoute(gereValeur.noeudV);
        }
        throw new Error('ajout de valeur impossible si pas groupe');
    }
    get contenus(): KfComposant[] {
        return this.noeudV.Enfants.map(e => (e.objet as KfComposantGereValeur).composant);
    }

    // ACCES AUX MEMBRES

    get abstractControl(): AbstractControl {
        if (this.estRacineV) {
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
    set abstractControl(control: AbstractControl) {
        if (this.estRacineV) {
            this._abstractControl = control;
            return;
        }
        throw new Error('impossible de fixer abstractControl');
    }

    get valeur(): any {
        if (this.estRacineV) {
            return this._valeur;
        } else {
            if (this.composant.groupeParent.valeur) {
                return this.composant.groupeParent.valeur[this.composant.nom];
            }
        }
    }
    set valeur(valeur: any) {
        if (this.estRacineV) {
            this._valeur = valeur;
        } else {
            if (this.composant.groupeParent.valeur) {
                this.composant.groupeParent.valeur[this.composant.nom] = valeur;
            }
        }
    }

    // GROUPE

    // INITIALISATION
    /** */
    prépare() {
        if (!this.estRacineV) {
            return;
        }
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                this._valeur = this.créeValeur();
                this._abstractControl = new FormGroup(this.créeControls());
                this._abstractControl.setValue(this._valeur);
                this.fixeValidators(this._abstractControl);
                break;
            case KfTypeDeComposant.liste:
                this._valeur = [];
                this._abstractControl = new FormArray([]);
                if (this._valeur) {
                    this._abstractControl.setValue(this._valeur);
                    this.fixeValidators(this._abstractControl);
                }
                break;
            default:
                const entrée = this.composant as KfEntrée;
                this._abstractControl = new FormControl();
                this._abstractControl.setValue(entrée._valeur);
                this.fixeValidators(this._abstractControl);
                break;
        }
    }

    // pour un groupe
    private créeValeur(): any {
        const valeur = {};
        let enfant = this.noeudV.enfant;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.typeDeComposant) {
                case KfTypeDeComposant.groupe:
                    const groupe = gereValeur.composant as KfGroupe;
                    valeur[groupe.nom] = gereValeur.créeValeur();
                    break;
                case KfTypeDeComposant.liste:
                    const liste = gereValeur.composant as KfListe;
                    valeur[liste.nom] = [];
                    break;
                case KfTypeDeComposant.vuetable:
                    const vueTable = gereValeur.icomposant as IKfVueTable;
                    valeur[gereValeur.composant.nom] = vueTable.valeurs;
                    break;
                default:
                    const entrée = gereValeur.composant as KfEntrée;
                    valeur[entrée.nom] = entrée._valeur === undefined ? null : entrée._valeur;
                    break;
            }
            enfant = enfant.suivant;
        }
        return valeur;
    }

    // pour un groupe
    private créeControls(): { [key: string]: AbstractControl; } {
        const controls: { [key: string]: AbstractControl; } = {};
        let enfant = this.noeudV.enfant;
        let abstractControl: AbstractControl;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.typeDeComposant) {
                case KfTypeDeComposant.groupe:
                    abstractControl = new FormGroup(gereValeur.créeControls());
                    break;
                case KfTypeDeComposant.liste:
                    abstractControl = new FormArray([]);
                    break;
                case KfTypeDeComposant.vuetable:
                    const vueTable = gereValeur.icomposant as IKfVueTable;
                    abstractControl = new FormArray(vueTable.formGroups);
                    break;
                default:
                    const entrée = gereValeur.composant as KfEntrée;
                    abstractControl = new FormControl();
                    abstractControl.setValue(entrée._valeur);
                    break;
            }
            controls[gereValeur.composant.nom] = abstractControl;
            gereValeur.fixeValidators(abstractControl);
            enfant = enfant.suivant;
        }
        return controls;
    }

    rétablit(valeur: any) {
        if (!this.estRacineV) {
            return;
        }
        switch (this.composant.typeDeComposant) {
            case KfTypeDeComposant.groupe:
                this._valeur = valeur;
                this.recréeListes(valeur);
                break;
            case KfTypeDeComposant.liste:
                const liste = this.composant as KfListe;
                liste.remplit(liste.creeItems.recréeItems(valeur));
                break;
            default:
                this._valeur = valeur;
                break;
        }
        this._abstractControl.reset(this._valeur);
    }

    // pour un groupe
    private recréeListes(valeur: any) {
        let enfant = this.noeudV.enfant;
        while (enfant) {
            const gereValeur = enfant.objet as KfComposantGereValeur;
            switch (gereValeur.composant.typeDeComposant) {
                case KfTypeDeComposant.groupe:
                    gereValeur.recréeListes(valeur[gereValeur.composant.nom]);
                    break;
                case KfTypeDeComposant.liste:
                    const liste = gereValeur.composant as KfListe;
                    liste.remplit(liste.creeItems.recréeItems(valeur[liste.nom]));
                    break;
                default:
                    break;
            }
            enfant = enfant.suivant;
        }
    }

    /* VALIDATION */

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
            this.fixeValidators(control);
        }
    }

    private fixeValidators(control: AbstractControl) {
        if (!this._validateurs) { return; }
        const validators = this._validateurs.filter(v => !!v.validatorFn).map(v => v.validatorFn);
        if (validators.length > 0) {
            control.setValidators(validators);
        }
        const asyncValidators = this._validateurs.filter(v => !!v.asyncValidatorFn).map(v => v.asyncValidatorFn);
        if (asyncValidators.length > 0) {
            control.setValidators(asyncValidators);
        }
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
        const validateurDe = (key: string) => {
            return this._validateurs && this._validateurs.find(v => v.nom === key);
        };
        const mesErreurs: ValidationErrors = {};
        Object.keys(erreursADistribuer).forEach(
            key => {
                const v = validateurDe(key);
                if (v) {
                    mesErreurs[key] = erreursADistribuer[key];
                    if (v.marqueErreur && this.abstractControl) {
                        v.marqueErreur(this.abstractControl.value);
                    }
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

