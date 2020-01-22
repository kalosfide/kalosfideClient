import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { TypeMesure } from '../type-mesure';
import { LigneDocument } from './ligne-base';
import { DocCLF } from './document';

export interface ICoût {
    valeur: number;
    complet: boolean;
}

export class CoûtDef<T> {
    iCoût: (t: T) => ICoût;
    valide: (t: T) => boolean;

    constructor(iCoût: (t: T) => ICoût, valide?: (t: T) => boolean) {
        this.iCoût = iCoût;
        this.valide = valide;
    }

    texte(t: T): string {
        return !this.valide || this.valide(t) ? Fabrique.texte.prix(this.iCoût(t)) : '';
    }

    agrége(ts: T[]): ICoût {
        const agrégé: ICoût = { valeur: 0, complet: true };
        let validés = ts;
        if (this.valide) {
            validés = ts.filter(t => this.valide(t));
            if (validés.length < ts.length) {
                agrégé.complet = false;
            }
        }
        validés.forEach( t => {
            const iCoût = this.iCoût(t);
            agrégé.valeur += iCoût.valeur;
            if (!iCoût.complet) {
                agrégé.complet = false;
            }
        });
        return agrégé;
    }

    texteAgrégé(items: T[]): string {
        return Fabrique.texte.prix(this.agrége(items));
    }
}

export class LigneDocumentCoût {
    private static _coûtDef(date: Date,
        àAgréger: (détail: LigneDocument) => number, agrégable?: (détail: LigneDocument) => boolean
        ): CoûtDef<LigneDocument> {
        return new CoûtDef(
            (détail: LigneDocument) => {
                const prix = détail.produit.prix;
                return { valeur: prix * àAgréger(détail), complet: true };
            },
            (détail: LigneDocument) => {
                if (agrégable && !agrégable(détail)) {
                    return false;
                }
                return Fabrique.texte.estNombre(àAgréger(détail));
            }
        );
    }

    static demande(date?: Date): CoûtDef<LigneDocument> {
        return LigneDocumentCoût._coûtDef(date,
            (détail: LigneDocument) => détail.demande,
            (détail: LigneDocument) => détail.typeCommande === TypeMesure.typeCommandeParDéfaut(détail.produit.typeMesure)
        );
    }

    static aLivrer(date?: Date): CoûtDef<LigneDocument> {
        return LigneDocumentCoût._coûtDef(date, (détail: LigneDocument) => détail.aLivrer);
    }

    static aFacturer(date?: Date): CoûtDef<LigneDocument> {
        return LigneDocumentCoût._coûtDef(date, (détail: LigneDocument) => détail.aFacturer);
    }

}

export class CommandeCoût {

    static demande(): CoûtDef<DocCLF> {
        return new CoûtDef((commande: DocCLF) => LigneDocumentCoût.demande().agrége(commande.lignes));
    }

    static aLivrer(): CoûtDef<DocCLF> {
        return new CoûtDef((commande: DocCLF) => LigneDocumentCoût.aLivrer().agrége(commande.lignes));
    }

    static aFacturer(): CoûtDef<DocCLF> {
        return new CoûtDef((commande: DocCLF) => LigneDocumentCoût.aFacturer().agrége(commande.lignes));
    }

}
