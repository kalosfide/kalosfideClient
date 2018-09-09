import { KfEntrée } from '../helpers/kf-composants/kf-composant/kf-entree';

export interface Entité {
   nom: string;
   champs: { [keys: string]: KfEntrée };
}
