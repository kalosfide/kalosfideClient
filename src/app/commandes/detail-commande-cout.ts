import { DetailCommande } from './detail-commande';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { TypeMesure } from '../modeles/type-mesure';
import { Commande } from './commande';
import { Facture } from '../fournisseur/factures/facture';

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

export class DetailCommandeCoût {
    private static _coûtDef(date: Date,
        àAgréger: (détail: DetailCommande) => number, agrégable?: (détail: DetailCommande) => boolean
        ): CoûtDef<DetailCommande> {
        return new CoûtDef(
            (détail: DetailCommande) => {
                const prix = détail.produit.prix;
                return { valeur: prix * àAgréger(détail), complet: true };
            },
            (détail: DetailCommande) => {
                if (agrégable && !agrégable(détail)) {
                    return false;
                }
                return Fabrique.texte.estNombre(àAgréger(détail));
            }
        );
    }

    static demande(date?: Date): CoûtDef<DetailCommande> {
        return DetailCommandeCoût._coûtDef(date,
            (détail: DetailCommande) => détail.demande,
            (détail: DetailCommande) => détail.typeCommande === TypeMesure.typeCommandeParDéfaut(détail.produit.typeMesure)
        );
    }

    static aLivrer(date?: Date): CoûtDef<DetailCommande> {
        return DetailCommandeCoût._coûtDef(date, (détail: DetailCommande) => détail.aLivrer);
    }

    static aFacturer(date?: Date): CoûtDef<DetailCommande> {
        return DetailCommandeCoût._coûtDef(date, (détail: DetailCommande) => détail.aFacturer);
    }

}

export class CommandeCoût {

    static demande(): CoûtDef<Commande> {
        return new CoûtDef((commande: Commande) => DetailCommandeCoût.demande().agrége(commande.détails));
    }

    static aLivrer(): CoûtDef<Commande> {
        return new CoûtDef((commande: Commande) => DetailCommandeCoût.aLivrer().agrége(commande.détails));
    }

    static aFacturer(): CoûtDef<Commande> {
        return new CoûtDef((commande: Commande) => DetailCommandeCoût.aFacturer().agrége(commande.détails));
    }

}

export class FactureCoût {

    static aFacturer(): CoûtDef<Facture> {
        return new CoûtDef((facture: Facture) => CommandeCoût.aFacturer().agrége(facture.commandes));
    }

}
