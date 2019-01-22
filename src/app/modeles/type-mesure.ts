import { TypeCommande, IdTypeCommande, TypesCommandes } from './type-commande';
import { textePrix } from './produit-prix';

export enum IdTypeMesure {
    ALaPièce = 'U',
    AuKilo = 'K',
    AuLitre = 'L',
}

const exemple = 12.25;

export class TypeMesure {
    private id: string;
    // texte select Vente
    public pourListe: string;
    // pour avoir: 10,50€ le kilo
    private pourPrix: string;
    private pourDemande: string;

    constructor(id: string, pourListe: string, pourPrix: string, pourDemande: string) {
        this.id = id;
        this.pourListe = pourListe;
        this.pourPrix = pourPrix;
        this.pourDemande = pourDemande;
    }
    get valeur(): string {
        return this.id;
    }
    texteDemande(demande: number): string {
        return demande.toLocaleString('fr-FR') + this.pourDemande;
    }
    get textePourDemande(): string {
        return this.pourDemande;
    }
    textePrix(prix: number): string {
        return textePrix(prix) + ' ' + this.pourPrix;
    }
    texteListe() {
        return this.pourListe + ' (ex: ' + this.textePrix(exemple) + ')';
    }
}

const ALaPièce = new TypeMesure(IdTypeMesure.ALaPièce, 'à l\'unité', '', ' pièce(s)');
const AuKilo = new TypeMesure(IdTypeMesure.AuKilo, 'au poids', ' le kilo', '  kg');
const AuLitre = new TypeMesure(IdTypeMesure.AuLitre, 'au volume', ' le litre', ' L');

export const TypesMesures = {
    ALaPièce: ALaPièce,
    AuKilo: AuKilo,
    AuLitre: AuLitre,
    Mesures: [ALaPièce, AuKilo, AuLitre],
    ParId: (id: string): TypeMesure => {
        switch (id) {
            case IdTypeMesure.ALaPièce:
                return ALaPièce;
            case IdTypeMesure.AuKilo:
                return AuKilo;
            case IdTypeMesure.AuLitre:
                return AuLitre;
            default:
                break;
        }
    },
    texteSeCommande: (typeMesure: TypeMesure, typeCommande: TypeCommande): string => {
        if (typeCommande.valeur === IdTypeCommande.ALUnité) {
            if (typeMesure.valeur === IdTypeMesure.ALaPièce) {
                return typeCommande.pourListe;
            }
            throw Error('Types de commande et de mesure incompatibles');
        }
        if (typeCommande.valeur === IdTypeCommande.EnVrac) {
            if (typeMesure.valeur === IdTypeMesure.ALaPièce) {
                throw Error('Types de commande et de mesure incompatibles');
            }
            return typeMesure.pourListe;
        }
        if (typeCommande.valeur === IdTypeCommande.ALUnitéOuEnVrac) {
            if (typeMesure.valeur === IdTypeMesure.ALaPièce) {
                throw Error('Types de commande et de mesure incompatibles');
            }
            return TypesCommandes.ALUnité.pourListe + ' ou ' + typeMesure.pourListe;
        }
    },
    texteTypeCommande: (typeMesure: TypeMesure, typeCommande: TypeCommande): string => {
        if (typeCommande.valeur === IdTypeCommande.ALUnité) {
                return typeCommande.pourListe;
        }
        if (typeCommande.valeur === IdTypeCommande.EnVrac) {
            return typeMesure.pourListe;
        }
    },
    texteDemande: (typeMesure: TypeMesure, typeCommande: TypeCommande, demande: number): string => {
        if (typeCommande.valeur === IdTypeCommande.ALUnité) {
                return ALaPièce.texteDemande(demande);
        }
        if (typeCommande.valeur === IdTypeCommande.EnVrac) {
            return typeMesure.texteDemande(demande);
        }
    }
};
