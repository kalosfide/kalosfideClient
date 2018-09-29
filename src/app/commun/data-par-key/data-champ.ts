import { KfComposant } from '../kf-composants/kf-composant/kf-composant';

export class DataChamp {
    composant: KfComposant;
    editable: boolean;

    get nom(): string { return this.composant.nom; }
}
