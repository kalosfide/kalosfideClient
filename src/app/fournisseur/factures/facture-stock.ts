import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { ApiFacture, ApiFactureLivraison, ApiFactureCommande } from './facture-api';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiDétailCommande, ApiDétailCommandeData } from 'src/app/commandes/api-commande';
import { FactureDétail } from './facture-detail';

export class FactureStock {
    catalogue: Catalogue;

    /**
     * Liste des listes des commandes livrées non facturées regroupées par client
     */
    factures: ApiFacture[];

    /**
     * Liste des No et Date des livraisons des commandes livrées non facturées
     */
    livraisons: ApiFactureLivraison[];

    /**
     * Numéro de la prochaine facture
     */
    noProchaineFacture: number;

    constructor(factures: ApiFacture[], noProchaineFacture: number) {
        this.factures = factures;
        this.noProchaineFacture = noProchaineFacture;
    }

    initialiseLivraisons(livraisons: ApiFactureLivraison[]): Date {
        let date = new Date(Date.now());
        this.factures.forEach(f => {
            f.commandes.forEach(c => {
                c.dateLivraison = new Date(livraisons.find(l => l.no === c.livraisonNo).date);
                if (c.dateLivraison < date) {
                    date = c.dateLivraison;
                }
            });
        });
        return date;
    }

    apiFacture(ikeyClient: IKeyUidRno): ApiFacture {
        return this.factures.find(f => ikeyClient.uid === f.uid && ikeyClient.rno === f.rno);
    }
    nbDétailsNonFacturés(ikeyClient: IKeyUidRno): number {
        const facture = this.apiFacture(ikeyClient);
        let nb = 0;
        if (facture) {
            facture.commandes.forEach(c => nb += c.details.filter(d => d.aFacturer === null || d.aFacturer === undefined).length);
        }
        return nb;
    }

    apiFactureCommande(ikeyCommande: IKeyUidRnoNo): ApiFactureCommande {
        const facture = this.apiFacture(ikeyCommande);
        if (facture) {
            return facture.commandes.find(c => ikeyCommande.no === c.no);
        }
    }

    apiDétail(détail: FactureDétail): ApiDétailCommandeData {
        const commande = this.apiFactureCommande(détail.apiCommande);
        if (commande) {
            return commande.details.find(d => d.no === détail.produit.no);
        }
    }
}
