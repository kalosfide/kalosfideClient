import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { FormGroup } from '@angular/forms';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';

export class KfGroupe extends KfComposant {
    nbValeurs: number;
    nbEntrées: number;

    private _masqué: boolean;
    legende: KfEtiquette;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.groupe);
    }

    créeGereValeur() {
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecGroupe);
    }

    masquable(masqueInitial: boolean) {
        this._masqué = masqueInitial;
    }

    get estMasquable(): boolean {
        return this._masqué !== undefined;
    }

    get masque(): boolean {
        return this._masqué === true;
    }

    basculeMasque() {
        this._masqué = !this._masqué;
    }

    private get nomGroupeBoutonsDeFormulaire(): string {
        return this.nom + 'boutons';
    }

    public get groupeBoutonsDeFormulaire(): KfGroupe {
        return this.contenus.find(c => c.nom === this.nomGroupeBoutonsDeFormulaire) as KfGroupe;
    }

    ajouteBoutonsDeFormulaire(boutonsDeFormulaire: KfBouton[]) {
        let groupe = this.groupeBoutonsDeFormulaire;
        if (!groupe) {
            groupe = new KfGroupe(this.nomGroupeBoutonsDeFormulaire);
            groupe.ajouteClasseDef('form-group btn-group');
        }
        boutonsDeFormulaire.forEach(b => groupe.ajoute(b));
        this.ajoute(groupe);
    }


    get valeur(): any {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: any) {
        this.gereValeur.valeur = valeur;
    }

    get formGroup(): FormGroup {
        return this.abstractControl as FormGroup;
    }

    /**
     */
    avecUnSeulContenuVisible(fncIndexSeulVisible: (() => number)) {
        this.gereVisible.avecUnSeulContenuVisible(() => this.contenus, fncIndexSeulVisible);
    }

    // FOCUS
    prendLeFocus(): boolean {
        if (this.gereHtml.prendLeFocus()) {
            return true;
        }
        return !!this.contenus.find(c => c.prendLeFocus());
    }

}
