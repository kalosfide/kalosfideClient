import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteImage } from '../../kf-partages/kf-texte-image';
import { KfRadio } from './kf-radio';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfGereTabIndex } from '../../kf-composant/kf-composant-gere-tabindex';

export class KfRadios extends KfEntrée {

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.radios);
        this._valeur = null;
        this.ajouteClasse('form-group', 'radio');
    }

    navigueAuClavier() {
        this.gereTabIndex = new KfGereTabIndex(this, {
            contenus: () => this.contenus,
            liéAChoisi: () => this.liéAChoisi()
        });
    }

    AjouteChoix(nom: string, valeur: string, texte: string) {
        const c = new KfRadio(this.nom + (this.enfants.length + 1), valeur, texte);
        this.noeud.Ajoute(c.noeud);
    }

    get contenus(): KfComposant[] {
        return this.enfants;
    }
    liéAChoisi(): KfComposant {
        const enCours = this.contenus.find(
            (c: KfComposant): boolean => {
                const input = c.gereHtml.htmlElement as HTMLInputElement;
                return input ? input.checked : false;
            });
        return enCours ? enCours : this.contenus[0];
    }
    // évènements
    get traiteClic(): (cliqué: KfComposant) => void { return null; }

    // données

    get valeur(): boolean {
        return this.litValeur() as boolean;
    }
    set valeur(valeur: boolean) {
        this.fixeValeur(valeur);
    }

}
