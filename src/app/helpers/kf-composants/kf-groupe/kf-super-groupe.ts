import { KfGroupe } from './kf-groupe';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfAnimeAttente } from '../kf-elements/kf-anime-attente/kf-anime-attente';
import { KfTypeAnimeAttente, KfAnimeAttenteFabrique } from '../kf-elements/kf-anime-attente/kf-anime-attente-fabrique';

export class KfSuperGroupe extends KfGroupe {

    /**
     * doit être fixée avant quandTousAjoutés
     * n'aura un effet que si le groupe est racine et avec valeur
     */
    sauveQuandChange: boolean;

    constructor(nom: string) {
        super(nom);
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
            groupe.ajouteClasse('form-group btn-group');
        }
        boutonsDeFormulaire.forEach(b => groupe.ajoute(b));
        this.ajoute(groupe);
    }

    quandTousAjoutés() {
        this.gereValeur.prépare();
        if (this.estFormulaire) {
            if (this.sauveQuandChange) {
                this.gereHtml.suitLaValeur = true;
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                    (e: KfEvenement) => {
                        this.gereHtml.suspendSuitLeStatut = true;
                        this.gereHtml.suspendSuitLaValeur = true;
                        this.gereValeur.depuisControl();
                        this.gereHtml.suspendSuitLeStatut = false;
                        this.gereHtml.suspendSuitLaValeur = false;
                        e.statut = KfStatutDEvenement.fini;
                    }
                );
            } else {
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
                    () => {
                    }
                );
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.retablit,
                    (e: KfEvenement) => {
                        this.rétablitFormulaire();
                        e.statut = KfStatutDEvenement.fini;
                    }
                );
                this.gereHtml.ajouteTraiteur(KfTypeDEvenement.soumet,
                    (e: KfEvenement) => {
                        this.soumetFormulaire();
                        e.statut = KfStatutDEvenement.fini;
                    }
                );
            }
        }
    }

    rétablitFormulaire() {
        this.gereValeur.rétablit(this.valeur);
        this.formGroup.reset(this.valeur);
    }

    soumetFormulaire() {
        if (!this.sauveQuandChange) {
            this.valeur = this.formGroup.value;
            this.formGroup.reset(this.valeur);
        }
    }
}
