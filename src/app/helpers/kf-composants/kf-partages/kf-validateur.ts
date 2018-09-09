import { ValidatorFn, ValidationErrors, AbstractControl, Validators } from '@angular/forms';
import { KfComposant } from '../kf-composant/kf-composant';

class KfValidateursFabrique {

    get required(): KfValidateur { return new KfValidateurRequired(); }
    aLaValeurDe(composant: KfComposant): KfValidateur { return new KfValidateurALaValeurDe(composant); }
    get requiredTrue(): KfValidateur { return new KfValidateurRequiredTrue(); }
    min(valeur: number): KfValidateur { return new KfValidateurMin(valeur); }
    max(valeur: number): KfValidateur { return new KfValidateurMax(valeur); }
    longueurMin(valeur: number): KfValidateur { return new KfValidateurLongueurMin(valeur); }
    longueurMax(valeur: number): KfValidateur { return new KfValidateurLongueurMax(valeur); }
    get email(): KfValidateur { return new KfValidateurEmail(); }
    get noSpaces(): KfValidateur { return new KfValidateurNoSpaces(); }
    requiredLength(valeur: number): KfValidateur { return new KfValidateurRequiredLength(valeur); }
    get requireDigit(): KfValidateur { return new KfValidateurRequireDigit(); }
    get requireLowercase(): KfValidateur { return new KfValidateurRequireLowercase(); }
    get requireUppercase(): KfValidateur { return new KfValidateurRequireUppercase(); }
    get requireNonAlphanumeric(): KfValidateur { return new KfValidateurRequireNonAlphanumeric(); }

    doublon(nomDuChamp: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = 'Doublon_' + nomDuChamp;
        return validateur;
    }
}

export const KfValidateurs = new KfValidateursFabrique();

export class KfValidateur {
    nom: string;
    validatorFn: ValidatorFn;
    message: string;
}

function créeValidatorFn(nom: string, invalideFn: (value: any) => boolean) {
    return (a: AbstractControl): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (invalideFn(a.value)) {
            errors[nom] = {
                value: a.value
            };
            return errors;
        }
        return null;
    };
}

class KfValidateurRequired extends KfValidateur {
    constructor() {
        super();
        this.nom = 'required';
        this.validatorFn = Validators.required;
        this.message = 'Ce champ est requis.';
    }
}

class KfValidateurALaValeurDe extends KfValidateur {
    composant: KfComposant;

    constructor(composant: KfComposant) {
        super();
        this.composant = composant;
        this.nom = 'aLaValeurDe';
        this.validatorFn = créeValidatorFn(this.nom, (value: any) => {
            return value !== this.composant.abstractControl.value;
        });
        this.message = 'Ce champ doit être coché.';
    }
}

class KfValidateurRequiredTrue extends KfValidateur {
    constructor() {
        super();
        this.nom = 'requiredTrue';
        this.validatorFn = créeValidatorFn(this.nom, (value: any) => value === true);
        this.message = 'Ce champ doit être coché.';
    }
}
class KfValidateurMin extends KfValidateur {
    min: number;

    constructor(min: number) {
        super();
        this.nom = 'min';
        this.min = min;
        this.validatorFn = Validators.min(this.min);
        this.message = 'Le nombre doit être supérieur ou égal à ' + this.min;
    }
}

class KfValidateurMax extends KfValidateur {
    max: number;

    constructor(max: number) {
        super();
        this.max = max;
        this.nom = 'max';
        this.validatorFn = Validators.max(this.max);
        this.message = 'Le nombre doit être inférieur ou égal à ' + this.max;
    }
}

class KfValidateurLongueurMin extends KfValidateur {
    min: number;

    constructor(min: number) {
        super();
        this.nom = 'minlength';
        this.min = min;
        this.validatorFn = Validators.minLength(this.min);
        this.message = 'Il doit y avoir au moins ' + this.min + ' caractères';
    }
}

class KfValidateurLongueurMax extends KfValidateur {
    max: number;

    constructor(max: number) {
        super();
        this.max = max;
        this.nom = 'maxlength';
        this.validatorFn = Validators.maxLength(this.max);
        this.message = 'Il doit y avoir au plus ' + this.max + ' caractères';
    }
}

class KfValidateurEmail extends KfValidateur {
    constructor() {
        super();
        this.nom = 'email';
        this.validatorFn = Validators.email;
        this.message = 'L\'adresse mail est invalide';
    }
}

// Password

const chiffres = '0123456789';
const minuscules = 'abcdefghijklmnopqrstuvwxyz';

function ContientUnDans(texte: string, liste: string): boolean {
    for (let i = 0; i < liste.length; i++) {
        if (texte.includes(liste[i])) {
            return true;
        }
    }
    return false;
}

function ContientUnHorsDe(texte: string, liste: string): boolean {
    for (let i = 0; i < texte.length; i++) {
        if (!liste.includes(texte[i])) {
            return true;
        }
    }
    return false;
}

class KfValidateurNoSpaces extends KfValidateur {
    constructor() {
        super();
        this.nom = 'NoSpaces';
        this.validatorFn = créeValidatorFn(this.nom, (texte: string) => {
            return !!texte && texte.includes(' ');
        });
        this.message = 'Le mot de passe ne doit pas contenir d\'espaces.';
    }
}

class KfValidateurRequiredLength extends KfValidateur {
    constructor(min: number) {
        super();
        this.nom = 'requiredLength';
        this.validatorFn = créeValidatorFn(this.nom, (texte: string) => {
            return !!texte && texte.length < min;
        });
        this.message = 'Le mot de passe doit avoir au moins ' + min + ' caractères';
    }
}

class KfValidateurRequireDigit extends KfValidateur {
    constructor() {
        super();
        this.nom = 'requireDigit';
        this.validatorFn = créeValidatorFn(this.nom, (texte: string) => !!texte && !ContientUnDans(texte, chiffres));
        this.message = 'Le mot de passe doit contenir au moins un chiffre.';
    }
}

class KfValidateurRequireLowercase extends KfValidateur {
    constructor() {
        super();
        this.nom = 'requireLowercase';
        this.validatorFn = créeValidatorFn(this.nom, (texte: string) => !!texte && !ContientUnDans(texte, minuscules));
        this.message = 'Le mot de passe doit contenir au moins une lettre minuscule.';
    }
}

class KfValidateurRequireUppercase extends KfValidateur {
    constructor() {
        super();
        this.nom = 'requireUppercase';
        this.validatorFn = créeValidatorFn(this.nom, (texte: string) => !!texte && !ContientUnDans(texte, minuscules.toUpperCase()));
        this.message = 'Le mot de passe doit contenir au moins une lettre majuscule.';
    }
}

class KfValidateurRequireNonAlphanumeric extends KfValidateur {
    constructor() {
        super();
        this.nom = 'requireNonAlphanumeric';
        this.validatorFn = créeValidatorFn(this.nom,
            (texte: string) => !!texte && !ContientUnHorsDe(texte, chiffres.concat(minuscules, minuscules.toUpperCase())));
        this.message = 'Le mot de passe doit contenir au moins un caractère non alphanumèrique.';
    }
}
