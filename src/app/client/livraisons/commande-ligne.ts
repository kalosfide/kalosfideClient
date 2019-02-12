import { Produit } from '../../modeles/produit';
import { KeyUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { TypesMesures } from '../../modeles/type-mesure';
import { IdTypeCommande, TypesCommandes } from '../../modeles/type-commande';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfListeDeroulante } from '../../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { KfInputNombre } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { KfVueCelluleDef } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';

export class CommandeDetail extends KeyUidRnoNo {
    typeCommande: string;
    demande: number;
    aLivrer: number;
}


export class CommandeLigne {
    produit: Produit;
    typeCommande: string;
    demande: number;

    typeCommandeListe: CommandeLigneType;
    demandeNombre: CommandeLigneDemande;

    private _cellulesEditables: KfVueCelluleDef[];

    constructor(produit: Produit) {
        this.produit = produit;
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
        d.uid = this.produit.uid;
        d.rno = this.produit.rno;
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

    get cellulesEditables(): KfVueCelluleDef[] {
        if (!this._cellulesEditables) {
            const options: { texte: string, valeur: string }[] = [];
            const type = this.produit.typeCommande;
            if (type === IdTypeCommande.ALUnité || type === IdTypeCommande.ALUnitéOuEnVrac) {
                options.push(this.option(IdTypeCommande.ALUnité));
            }
            if (type === IdTypeCommande.EnVrac || type === IdTypeCommande.ALUnitéOuEnVrac) {
                options.push(this.option(IdTypeCommande.EnVrac));
            }

            this.typeCommande = options[options.length - 1].valeur;

            this.typeCommandeListe = new CommandeLigneType(this, options);
            this.demandeNombre = new CommandeLigneDemande(this);

            this._cellulesEditables = [
                this.nomCategorie,
                this.nomProduit,
                this.textePrix,
                this.typeCommandeListe,
                this.demandeNombre
            ];
        }
        return this._cellulesEditables;
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
