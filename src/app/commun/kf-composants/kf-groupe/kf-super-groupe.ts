import { KfGroupe } from './kf-groupe';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';

/**
 * racine d'un arbre de disposition
 */
export class KfSuperGroupe extends KfGroupe {

    /**
     * doit être fixée avant quandTousAjoutés
     * n'aura un effet que si le groupe est racine et avec valeur
     */
    sauveQuandChange: boolean;

    constructor(nom: string) {
        super(nom);
    }

    /**
     * les composants sont ajoutés dans la disposition
     * les noeudV sont créés avec les gèreValeur
     * les racineV sont désignés
     * les noeudV des composants ayant été ajoutés à la valeur d'un composant ont un parent
     *
     * Il faut:
     *  créer la liste des racineV
     *  ajouter un noeudV qui n'est pas une racineV et qui n'a pas de parentV au noeudV
     *  du plus proche ancêtre de disposition qui en a un
     *  lancer gereValeur.prepare pour chaque racine
     */
    quandTousAjoutés() {
        const racines: KfComposant[] = [];
        const prépareV = (composant: KfComposant, parentV: KfComposant) => {
            let pV = parentV;
            if (composant.gereValeur) {
                if (composant.estRacineV) {
                    racines.push(composant);
                    pV = composant;
                } else {
                    const noeudV = composant.gereValeur.noeudV;
                    if (!noeudV.parent) {
                        if (!parentV) {
                            throw new Error(`noeudV sans racineV: ${composant.nom}`);
                        }
                        parentV.gereValeur.noeudV.Ajoute(noeudV);
                    }
                    if (composant.typeDeComposant === KfTypeDeComposant.groupe) {
                        pV = composant;
                    }
                }
            }
            const noeudD = composant.noeud;
            let enfant = noeudD.enfant;
            while (enfant) {
                prépareV(enfant.objet as KfComposant, pV);
                enfant = enfant.suivant;
            }
        };
        if (this.gereValeur) {
            this.gereValeur.estRacineV = true;
        }
        prépareV(this, null);

        racines.forEach(r => r.gereValeur.prépare());

        if (this.estRacineV) {
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
