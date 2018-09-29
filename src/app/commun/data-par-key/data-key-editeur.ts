import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataApiRoutes } from './data-api-routes';
import { DataChamp } from './data-champ';
import { DataKey } from './data-key';
import { KfTraitementDEvenement, KfTypeDEvenement } from '../kf-composants/kf-partages/kf-evenements';

export abstract class DataKeyEditeur {
    champsKeys: DataChamp[];
    keyAuto: boolean; /* vrai si la clé est générée par la base de données */

    autresChamps: DataChamp[];

    edition: KfGroupe;

    traiteursDEvenement: { type: KfTypeDEvenement, traitement: KfTraitementDEvenement}[];

    protected abstract créeChampsKeys();
    abstract fixeChampsKeys(key: DataKey);
    protected abstract créeAutresChamps();

    créeEdition(action: string) {
        this.edition = new KfGroupe(action);
        const sansKey = action === DataApiRoutes.Api.ajoute && this.keyAuto;
        if (!sansKey) {
            this.créeChampsKeys();
            this.champsKeys.forEach(champ => {
                champ.composant.visibilite = false;
                this.edition.ajoute(champ.composant);
            });
        }
        this.créeAutresChamps();
        this.autresChamps.forEach(champ => {
            const désactivé = action === DataApiRoutes.Api.edite && !champ.editable;
            if (désactivé) {
                champ.composant.désactive();
            }
            this.edition.ajoute(champ.composant);
        });
        // évènements
        this.traiteursDEvenement.forEach(
            traiteur => this.edition.gereHtml.ajouteTraiteur(traiteur.type, traiteur.traitement));
    }

    get valeur(): any {
        return this.edition.valeur;
    }

    set valeur(valeur: any) {
        this.edition.valeur = valeur;
    }
}
