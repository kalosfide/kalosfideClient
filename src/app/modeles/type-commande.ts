const PAS_INPUT_A_LA_PIECE = 1;
const PAS_INPUT_DECIMAL = 0.001;

export enum IdTypeCommande {
    ALUnité = '1',
    EnVrac = '2',
    ALUnitéOuEnVrac = '3',
}

export class TypeCommande {
    static commandes: IdTypeCommande[] = [IdTypeCommande.ALUnité, IdTypeCommande.EnVrac, IdTypeCommande.ALUnitéOuEnVrac];
    static pourListe(id: string): string {
        switch (id) {
            case IdTypeCommande.ALUnité:
                return 'à l\'unité';
            case IdTypeCommande.EnVrac:
                return 'en vrac';
            case IdTypeCommande.ALUnitéOuEnVrac:
                return 'à l\'unité ou en vrac';
            default:
                throw new Error(`TypeCommande: la valeur ${id} n'appartient pas au type`);
        }
    }
    static pourExemple(id: string): string {
        switch (id) {
            case IdTypeCommande.ALUnité:
                return '2 produits';
            case IdTypeCommande.EnVrac:
                return '2,5 kg de produit';
            case IdTypeCommande.ALUnitéOuEnVrac:
                break;
            default:
                throw new Error(`TypeCommande: la valeur ${id} n'appartient pas au type`);
        }
    }
    static pasInputNombre(id: string): number {
        switch (id) {
            case IdTypeCommande.ALUnité:
                return PAS_INPUT_A_LA_PIECE;
            case IdTypeCommande.EnVrac:
                return PAS_INPUT_DECIMAL;
            default:
                break;
        }
    }
}
