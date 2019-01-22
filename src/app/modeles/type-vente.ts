import { TypeCommande, IdTypeCommande } from './type-commande';
import { TypeMesure, IdTypeMesure } from './type-mesure';

export class TypeVente {
    commande: TypeCommande;
    mesure: TypeMesure;

    get valide(): boolean {
        return this.mesure.valeur !== IdTypeMesure.ALaPièce || this.commande.valeur === IdTypeCommande.ALUnité;
    }
}
