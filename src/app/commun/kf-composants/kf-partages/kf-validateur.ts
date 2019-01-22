import { ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl, Validators } from '@angular/forms';
import { KfComposant } from '../kf-composant/kf-composant';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class KfValidateur {
    nom: string;
    validatorFn: ValidatorFn;
    asyncValidatorFn: AsyncValidatorFn;
    message: string;

    marqueErreur: (a: AbstractControl) => void;
}
class KfValidateurDoublon extends KfValidateur {
    doublon: any;

    constructor(nom: string, message: string) {
        super();
        this.nom = nom;
        this.validatorFn = (a: AbstractControl): ValidationErrors => this._validatorFn(a);
        this.marqueErreur = (a: AbstractControl) => {
            this.doublon = a.value;
        };
        message = message;
    }

    _validatorFn(a: AbstractControl): ValidationErrors {
        const errors: ValidationErrors = {};
        if (a.value === this.doublon) {
            errors[this.nom] = {
                value: a.value
            };
            return errors;
        }
        return null;
    }
}

class KfValidateursFabrique {
    chiffres = '0123456789';
    minuscules = 'abcdefghijklmnopqrstuvwxyz';

    contientUnDans(texte: string, liste: string): boolean {
        for (let i = 0; i < liste.length; i++) {
            if (texte.includes(liste[i])) {
                return true;
            }
        }
        return false;
    }

    contientUnHorsDe(texte: string, liste: string): boolean {
        if (!texte) {
            return false;
        }
        for (let i = 0; i < texte.length; i++) {
            if (!liste.includes(texte[i])) {
                return true;
            }
        }
        return false;
    }

    validateurDeFn(nom: string, invalideFn: (value: any) => boolean, message: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.validatorFn = (a: AbstractControl): ValidationErrors => {
            const errors: ValidationErrors = {};
            if (invalideFn(a.value)) {
                errors[nom] = {
                    value: a.value
                };
                return errors;
            }
            return null;
        };
        validateur.message = message;
        return validateur;
    }

    validateurDoublon(nom: string, message: string): KfValidateur {
        return new KfValidateurDoublon(nom, message);
    }

    validateur(nom: string, validatorFn: ValidatorFn, message: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.validatorFn = validatorFn;
        validateur.message = message;
        return validateur;
    }

    validateurAsync(nom: string, invalideFn: (value: any) => Observable<boolean>, message: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.asyncValidatorFn = (a: AbstractControl): Observable<ValidationErrors> => {
            return invalideFn(a.value).pipe(
                map(invalide => {
                    if (invalide) {
                        const errors: ValidationErrors = {};
                        errors[nom] = { value: a.value };
                        return errors;
                    }
                    return null;
                }),
                catchError(() => null)
            );
        };
        validateur.message = message;
        return validateur;
    }

    get required(): KfValidateur {
        return this.validateur('required', Validators.required, 'Ce champ est requis.');
    }
    get requiredTrue(): KfValidateur {
        return this.validateur('requiredTrue', Validators.requiredTrue, 'Ce champ doit être coché.');
    }
    min(valeur: number): KfValidateur {
        return this.validateur(
            'min',
            Validators.min(valeur),
            `Le nombre doit être supérieur ou égal à ${valeur}`
        );
    }
    max(valeur: number): KfValidateur {
        return this.validateur(
            'max',
            Validators.max(valeur),
            `Le nombre doit être inférieur ou égal à ${valeur}`
        );
    }
    longueurMin(valeur: number): KfValidateur {
        return this.validateur(
            'minLength',
            Validators.minLength(valeur),
            `Il doit y avoir au moins ${valeur} caractères`
        );
    }
    longueurMax(valeur: number): KfValidateur {
        return this.validateur(
            '',
            Validators.maxLength(valeur),
            `Il doit y avoir au plus ${valeur} caractères`
        );
    }

    get email(): KfValidateur {
        return this.validateur('email', Validators.email, `L'adresse mail est invalide.`);
    }

    get noSpaces(): KfValidateur {
        return this.validateurDeFn(
            'NoSpaces',
            (texte: string) => {
                return !!texte && texte.includes(' ');
            },
            `Il ne doit pas y avoir d'espaces`);
    }
    requiredLength(valeur: number): KfValidateur {
        return this.validateurDeFn(
            'requiredLength',
            (texte: string) => {
                return !!texte && texte.length < valeur;
            },
            `Il doit y avoir au moins ${valeur} caractères`);
    }
    get requireDigit(): KfValidateur {
        return this.validateurDeFn(
            'requireDigit',
            (texte: string) => !!texte && !this.contientUnDans(texte, this.chiffres),
            'Il doit y avoir au moins un chiffre.');
    }
    get requireLowercase(): KfValidateur {
        return this.validateurDeFn(
            'requireLowercase',
            (texte: string) => !!texte && !this.contientUnDans(texte, this.minuscules),
            'Il doit y avoir au moins une lettre minuscule.');
    }
    get requireUppercase(): KfValidateur {
        return this.validateurDeFn(
            'requireUppercase',
            (texte: string) => !!texte && !this.contientUnDans(texte, this.minuscules.toUpperCase()),
            'Il doit y avoir au moins une lettre majuscule.');
    }
    get requireNonAlphanumeric(): KfValidateur {
        return this.validateurDeFn(
            'requireNonAlphanumeric',
            (texte: string) =>
                !!texte && !this.contientUnHorsDe(texte, this.chiffres.concat(this.minuscules, this.minuscules.toUpperCase())),
            'Il doit y avoir au moins un caractère non alphanumèrique.');
    }

    aLaValeurDe(composant: KfComposant): KfValidateur {
        return this.validateurDeFn(
            'aLaValeurDe',
            (value: any) => {
                return value !== composant.abstractControl.value;
            },
            `La valeur n'est pas celle de ${composant.texte}`);
    }
}

export const KfValidateurs = new KfValidateursFabrique();
