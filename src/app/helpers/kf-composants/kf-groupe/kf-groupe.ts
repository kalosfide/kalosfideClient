import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';

export class KfGroupe extends KfComposant {

    estConteneurSansValeur: boolean;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.groupe);
        this.gereValeur = new KfComposantGereValeur(this);
        this.ajouteClasse('kf-groupe');
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
