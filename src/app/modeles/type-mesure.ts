import { IdTypeCommande, TypeCommande } from './type-commande';

export enum IdTypeMesure {
    ALaPièce = 'U',
    AuKilo = 'K',
    AuLitre = 'L',
}

export class TypeMesure {
    static Mesures: IdTypeMesure[] = [IdTypeMesure.ALaPièce, IdTypeMesure.AuKilo, IdTypeMesure.AuLitre];

    static unité(id: string): string {
        switch (id) {
            case IdTypeMesure.ALaPièce:
                break;
            case IdTypeMesure.AuKilo:
                return 'kg';
            case IdTypeMesure.AuLitre:
                return 'L';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texte_le(id: string): string {
        switch (id) {
            case IdTypeMesure.ALaPièce:
                return 'la pièce';
            case IdTypeMesure.AuKilo:
                return 'le kg';
            case IdTypeMesure.AuLitre:
                return 'le L';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texte_au(id: string): string {
        switch (id) {
            case IdTypeMesure.ALaPièce:
                return 'à l\'unité';
            case IdTypeMesure.AuKilo:
                return 'au poids';
            case IdTypeMesure.AuLitre:
                return 'au volume';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texteSeCommande(idTypeMesure: string, idTypeCommande: string): string {
        if (idTypeMesure === IdTypeMesure.ALaPièce && idTypeCommande !== IdTypeCommande.ALUnité) {
            throw Error('Types de commande et de mesure incompatibles');
        }
        if (idTypeCommande === IdTypeCommande.ALUnitéOuEnVrac) {
            return TypeCommande.pourListe(IdTypeCommande.ALUnité) + ' ou ' + TypeMesure.texte_au(idTypeMesure);
        } else {
            return TypeMesure.texte_au(idTypeMesure);
        }
    }
}
