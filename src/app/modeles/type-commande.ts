
export enum IdTypeCommande {
    ALUnité = '1',
    EnVrac = '2',
    ALUnitéOuEnVrac = '3',
}

export class TypeCommande {
    private id: string;
    // texte select Vente
    public pourListe: string;
    // pour avoir: 10,50€ le kilo
    private pourExemple: string;
    constructor(id: string, pourListe: string, pourExemple: string) {
        this.id = id;
        this.pourListe = pourListe;
        this.pourExemple = pourExemple;
    }
    get valeur(): string {
        return this.id;
    }
    texteExemple(): string {
        return this.pourExemple ? ' (ex: ' + this.pourExemple + ')' : '';
    }
    texteListe() {
        return this.pourListe + this.texteExemple();
    }
}

const ALUnité = new TypeCommande(IdTypeCommande.ALUnité, 'à l\'unité', '2 produits');
const EnVrac = new TypeCommande(IdTypeCommande.EnVrac, 'en vrac', '2,5 kg de produit');
const ALUnitéOuEnVrac = new TypeCommande(IdTypeCommande.ALUnitéOuEnVrac, 'à l\'unité ou en vrac', null);

export const TypesCommandes = {
    ALUnité: ALUnité,
    EnVrac: EnVrac,
    ALUnitéOuEnVrac: ALUnitéOuEnVrac,
    Commandes: [ALUnité, EnVrac, ALUnitéOuEnVrac],
    ParId: (id: string): TypeCommande => {
        switch (id) {
            case IdTypeCommande.ALUnité:
                return ALUnité;
            case IdTypeCommande.EnVrac:
                return EnVrac;
            case IdTypeCommande.ALUnitéOuEnVrac:
                return ALUnitéOuEnVrac;
            default:
                break;
        }
    }
};
