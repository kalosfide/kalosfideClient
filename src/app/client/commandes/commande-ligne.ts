import { Produit, CompareProduits } from '../../modeles/produit';
import { TypesMesures } from '../../modeles/type-mesure';
import { IdTypeCommande, TypesCommandes } from '../../modeles/type-commande';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfListeDeroulante } from '../../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { KfInputNombre } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Commande } from './commande';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfVueCelluleDef, KfVueTableEnTete } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { Tri } from 'src/app/commun/outils/trieur';

export class CommandeDetail {
    no: number;
    typeCommande: string;
    demande: number;
}

export class CommandeLigne {
    produit: Produit;
    typeCommande: string;
    demande: number;

    private _optionsTypeCommande: { texte: string, valeur: string }[] = [];
    private _typeCommande: string;
    private _demande: number;

    typeCommandeListe: CommandeLigneType;
    demandeNombre: CommandeLigneDemande;

    private _superGroupe: KfSuperGroupe;

    constructor(produit: Produit, commande: Commande) {
        this.produit = produit;
        if (produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac || produit.typeCommande === IdTypeCommande.ALUnité) {
            this._optionsTypeCommande.push(this.option(IdTypeCommande.ALUnité));
        }
        if (produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac || produit.typeCommande === IdTypeCommande.EnVrac) {
            this._optionsTypeCommande.push(this.option(IdTypeCommande.EnVrac));
        }

        const detail = commande.details.find(d => d.no === produit.no);
        if (detail) {
            this._typeCommande = detail.typeCommande;
            this._demande = detail.demande;
        } else {
            this._typeCommande = this._optionsTypeCommande ? this._optionsTypeCommande[0].valeur : this.produit.typeCommande;
        }
        this.typeCommande = this._typeCommande;
        this.demande = this._demande;
    }

    get changé(): boolean {
        return this.typeCommande !== this._typeCommande || this.demande !== this._demande;
    }

    initialise() {
        this._typeCommande = this._optionsTypeCommande ? this._optionsTypeCommande[0].valeur : this.produit.typeCommande;
        this._demande = undefined;
        this.typeCommande = this._typeCommande;
        this.demande = this._demande;
    }

    get nomProduit(): string { return this.produit.nom; }
    get noCategorie(): number { return this.produit.categorieNo; }
    get nomCategorie(): string { return this.produit.nomCategorie; }
    get typeMesure(): string { return this.produit.typeMesure; }
    get prix(): number { return this.produit.prix; }
    get uid2(): string { return this.produit.uid; }
    get rno2(): number { return this.produit.rno; }
    get no2(): number { return this.produit.no; }

    get texteDemande(): string {
        return TypesMesures.texteDemande(TypesMesures.ParId(this.typeMesure),
            TypesCommandes.ParId(this.typeCommande), this.demande);
    }

    _texteTypeDemande(typeCommande: string): string {
        return TypesMesures.texteTypeCommande(TypesMesures.ParId(this.typeMesure), TypesCommandes.ParId(typeCommande));
    }

    get texteTypeDemande(): string {
        return this._texteTypeDemande(this.typeCommande);
    }

    get textePrix(): string {
        return TypesMesures.ParId(this.typeMesure).textePrix(this.prix);
    }

    get cellules(): KfVueCelluleDef[] {
        return [
            this.nomCategorie,
            this.nomProduit,
            this.textePrix,
            this.texteDemande,
        ];
    }

    créeDetail(): CommandeDetail {
        const d = new CommandeDetail();
        d.no = this.produit.no;
        d.typeCommande = this.typeCommande;
        d.demande = this.demande;
        return d;
    }

    private option(typeCommande: string): { texte: string, valeur: string } {
        return {
            texte: this._texteTypeDemande(typeCommande),
            valeur: typeCommande
        };
    }

    private _créeSuperGroupe() {
        this._superGroupe = new KfSuperGroupe('' + this.produit.no);
        this._superGroupe.créeGereValeur();
        this._superGroupe.estRacineV = true;
        const no = new KfInputNombre('no');
        no._valeur = this.produit.no;
        no.visibilite = false;
        this._superGroupe.ajoute(no);
        this.typeCommandeListe = new CommandeLigneType(this, this._optionsTypeCommande);
        this.typeCommandeListe._valeur = this.typeCommande;
        this._superGroupe.ajoute(this.typeCommandeListe);
        this.demandeNombre = new CommandeLigneDemande(this);
        this.demandeNombre._valeur = this.demande;
        this._superGroupe.ajoute(this.demandeNombre);
        this._superGroupe.quandTousAjoutés();
    }

    créeSuperGroupe() {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
    }

    get superGroupe(): KfSuperGroupe {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return this._superGroupe;
    }

    get cellulesEditables(): KfVueCelluleDef[] {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return [
            this.nomCategorie,
            this.nomProduit,
            this.textePrix,
            this.typeCommandeListe.options.length > 1 ? this.typeCommandeListe : this.texteTypeDemande,
            this.demandeNombre
        ];
    }

}

export function NomTypeCommande(ligne: CommandeLigne): string {
    return `typeCommande_${ligne.produit.no}`;
}
export function CommeCommandeLigneType(composant: KfComposant): CommandeLigneType {
    const noms = composant.nom.split('_');
    if (noms.length === 2 && noms[0] === 'typeCommande') {
        return composant as CommandeLigneType;
    }
}

export class CommandeLigneType extends KfListeDeroulante {
    ligne: CommandeLigne;

    constructor(ligne: CommandeLigne, options: { texte: string, valeur: string }[]) {
        super(NomTypeCommande(ligne));
        this.ligne = ligne;
        options.forEach(o => {
            this.ajouteOption(o.texte, o.valeur);
        });
        this.nullImpossible = true;
        this.valeur = ligne.typeCommande;
        this.gereHtml.suitLaValeur = true;
        this.gereValeur.prépare();
    }

}

export function NomDemande(ligne: CommandeLigne): string {
    return `demande_${ligne.produit.no}`;
}
export function CommeCommandeLigneDemande(composant: KfComposant): CommandeLigneDemande {
    const noms = composant.nom.split('_');
    if (noms.length === 2 && noms[0] === 'demande') {
        return composant as CommandeLigneDemande;
    }
}

export class CommandeLigneDemande extends KfInputNombre {
    ligne: CommandeLigne;

    constructor(ligne: CommandeLigne) {
        super(NomDemande(ligne));
        this.ajouteClasseDef('form-control-sm');
        this.ligne = ligne;
        this.min = 0;
        this.rafraichit();
        this.gereHtml.suitLaValeur = true;
        this.gereValeur.prépare();
    }

    rafraichit() {
        this.valeur = 0;
        this.pas = this.ligne.typeCommande === IdTypeCommande.ALUnité ? 1 : 0.001;
    }
}

function compareProduit(cl1: CommandeLigne, cl2: CommandeLigne): number {
    return CompareProduits.nom(cl1.produit, cl2.produit);
}

function compareCategorie(cl1: CommandeLigne, cl2: CommandeLigne): number {
    return CompareProduits.nomCategorie(cl1.produit, cl2.produit);
}

const enTeteCatégorie: KfVueTableEnTete<CommandeLigne> = {
    texte: 'Catégorie',
    tri: new Tri('categorie', compareCategorie)
};
const enTeteProduit: KfVueTableEnTete<CommandeLigne> = {
    texte: 'Nom',
    tri: new Tri('produit', compareProduit)
};
const enTetePrix: KfVueTableEnTete<CommandeLigne> = {
    texte: 'Prix',
};
const enTeteType: KfVueTableEnTete<CommandeLigne> = {
    texte: 'Type de commande',
};
const enTeteQuantité: KfVueTableEnTete<CommandeLigne> = {
    texte: 'Quantité',
};

export const CommandeLigneEnTetes: KfVueTableEnTete<CommandeLigne>[] = [
    enTeteCatégorie,
    enTeteProduit,
    enTetePrix,
    enTeteQuantité,
];

export const CommandeLigneEnTetesEditables: KfVueTableEnTete<CommandeLigne>[] = [
    enTeteCatégorie,
    enTeteProduit,
    enTetePrix,
    enTeteType,
    enTeteQuantité,
];
