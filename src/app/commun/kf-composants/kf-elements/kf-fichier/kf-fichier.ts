import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteImage } from '../../kf-partages/kf-texte-image/kf-texte-image';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { FormControl } from '@angular/forms';
import { KfParametres } from '../../kf-composants-parametres';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';


export function KfNomFichier(nom: string): string {
    return nom + '_file';
}

export const TypeDeFichier = {
    texte: 'texte',
    objet: 'objet',
};

export class KfFichier extends KfElement {

    typeDeFichier: string;

    files: File[];

    multiple: boolean;

    typesMime: string[];
    typesExtension: string[];
    _typesAcceptes: string;

    inputVisible: boolean;

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(KfNomFichier(nom), KfTypeDeComposant.fichier, texte, imageAvant, imageApres);
        if (texte || imageAvant || imageApres) {
            this.fixeTexte(texte);
            this.fixeUrlImageAvant(imageAvant);
            this.fixeUrlImageApres(imageApres);
        } else {
            this.fixeTexte(KfParametres.fichierParDefaut.texteCharge);
        }
        this.typesMime = [];
        this.typesExtension = [];
        this.ajouteClasseDef('kf-fichier', 'kf-bouton');
    }

    get idBouton(): string {
        return this.nom + '_b';
    }

    get typesAcceptes(): string {
        if (this._typesAcceptes) {
            return this._typesAcceptes;
        } else {
            return this.typesMime.concat(this.typesExtension).join(', ');
        }
    }
    set typesAcceptes(typesAcceptes: string) {
        this._typesAcceptes = typesAcceptes;
    }

    get formControl(): FormControl {
        return this.abstractControl as FormControl;
    }

    get nomsFichiers(): string {
        return this.files ? this.files.map(f => f.name).join(', ') : 'aucun';
    }

}
