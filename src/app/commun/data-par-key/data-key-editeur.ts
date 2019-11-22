import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataKey } from './data-key';
import { KfTraitementDEvenement, KfTypeDEvenement } from '../kf-composants/kf-partages/kf-evenements';
import { ApiAction } from '../api-route';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { DataKeyALESComponent } from './data-key-ales.component';
import { DataKeyService } from './data-key.service';
import { DataKeyUtile } from './data-key-utile';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';

export abstract class DataKeyEditeur<T extends DataKey> {
    private _utile: DataKeyUtile<T>;

    champsKeys: KfComposant[];
    /**
     * vrai si la clé est générée par la base de données
     */
    keyAuto: boolean;

    private autresChamps: KfComposant[];

    edition: KfGroupe;

    traiteursDEvenement: { type: KfTypeDEvenement, traitement: KfTraitementDEvenement }[];

    get utile(): DataKeyUtile<T> {
        return this._utile;
    }

    protected abstract créeChampsKeys(): void;
    abstract fixeChampsKeys(key: DataKey): void;
    protected abstract créeAutresChamps(component: DataKeyALESComponent<T>): void;

    protected ajoute(...composants: KfComposant[]) {
        composants.forEach(composant => {
            this.autresChamps.push(composant);
            });
    }

    créeEdition(component: DataKeyALESComponent<T>) {
        this.edition = new KfGroupe(component.action.nom);
        this.edition.créeGereValeur();
        const sansKey = component.action.nom === ApiAction.data.ajoute && this.keyAuto;
        if (!sansKey) {
            this.champsKeys = this.utile.edite.champsKey();
            this.champsKeys.forEach(composant => {
                composant.visible = false;
                this.edition.ajoute(composant);
            });
        }
        this.autresChamps = [];
        this.créeAutresChamps(component);
        this.autresChamps.forEach(composant => {
            this.edition.ajoute(composant);
        });
        // évènements
        if (this.traiteursDEvenement) {
            this.traiteursDEvenement.forEach(
                traiteur => this.edition.gereHtml.ajouteTraiteur(traiteur.type, traiteur.traitement));
        }
    }

    créeSupergroupe(): KfSuperGroupe {
        const superGroupe = new KfSuperGroupe('');
        superGroupe.créeGereValeur();
        const champsKeys = this.utile.edite.champsKey();
        champsKeys.forEach(composant => {
                composant.visible = false;
                superGroupe.ajoute(composant);
            });

        this.autresChamps = [];
        this.créeAutresChamps(component);
        this.autresChamps.forEach(composant => {
            this.edition.ajoute(composant);
        });
        // évènements
        if (this.traiteursDEvenement) {
            this.traiteursDEvenement.forEach(
                traiteur => this.edition.gereHtml.ajouteTraiteur(traiteur.type, traiteur.traitement));
        }
    }

    get valeur(): T {
        return this.edition.valeur;
    }
    fixeValeur(valeur: T) {
        console.log(this.edition);
        console.log(valeur, this.edition.valeur, this.edition.formGroup);
        this.edition.fixeValeur(valeur);
        /*
        */
    }
}
