import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataKey } from './data-key';
import { KfTraitementDEvenement, KfTypeDEvenement } from '../kf-composants/kf-partages/kf-evenements';
import { ApiAction } from '../api-route';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';

export abstract class DataKeyEditeur<T extends DataKey> {
    champsKeys: KfComposant[];
    keyAuto: boolean; /* vrai si la clé est générée par la base de données */

    private autresChamps: KfComposant[];

    edition: KfGroupe;

    traiteursDEvenement: { type: KfTypeDEvenement, traitement: KfTraitementDEvenement }[];

    protected abstract créeChampsKeys();
    abstract fixeChampsKeys(key: DataKey);
    protected abstract créeAutresChamps(action: string);

    protected ajoute(...composants: KfComposant[]) {
        composants.forEach(composant => {
            this.autresChamps.push(composant);
            });
    }

    créeEdition(action: string) {
        this.edition = new KfGroupe(action);
        this.edition.créeGereValeur();
        const sansKey = action === ApiAction.data.ajoute && this.keyAuto;
        if (!sansKey) {
            this.créeChampsKeys();
            this.champsKeys.forEach(composant => {
                composant.visibilite = false;
                this.edition.ajoute(composant);
            });
        }
        this.autresChamps = [];
        this.créeAutresChamps(action);
        this.autresChamps.forEach(composant => {
            this.edition.ajoute(composant);
        });
        // évènements
        if (this.traiteursDEvenement) {
            this.traiteursDEvenement.forEach(
                traiteur => this.edition.gereHtml.ajouteTraiteur(traiteur.type, traiteur.traitement));
        }
    }

    get valeur(): any {
        return this.edition.formGroup.value;
    }
    set valeur(valeur: any) {
        console.log(valeur, this.edition.valeur, this.edition.formGroup);
        this.edition.contenus.forEach(c => {
            if (c.abstractControl) {
                c.abstractControl.setValue(valeur[c.nom]);
            }
        });
        console.log(valeur, this.edition.valeur, this.edition.formGroup);
        /*
        */
    }
}
