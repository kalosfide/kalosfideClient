import { Commande } from 'src/app/commandes/commande';
import { Client } from 'src/app/modeles/client/client';
import { LivraisonStock } from './livraison-stock';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

export class LivraisonCommandes {

    private _stock: LivraisonStock;
    get stock(): LivraisonStock { return this._stock; }

    private _commandes: Commande[];
    /**
     * s'il n'y a jamais eu de livraison, indéfini
     * sinon
     *      si le site n'est pas d'état Livraison, commandes de la dernière livraison
     *      sinon, commandes de la livraison en cours et dernières commandes des clients qui ne sont pas dans la dernière livraison
     *
     *      dernières commandes des clients
     */
    get commandes(): Commande[] { return this._commandes; }

    constructor(stock: LivraisonStock) {
        this._stock = stock;
        const àTraiter = stock.apiCommandesATraiter;
        if (àTraiter) {
            this._commandes = àTraiter.map(apiCommande => this.créeCommande(apiCommande, stock.clients));
        } else {
            // il n'y a jamais eu de livraison
            this._commandes = [];
        }
    }

    private créeCommande(apiCommande: ApiCommande, clients: Client[]): Commande {
        const client = clients.find(cl => KeyUidRno.compareKey(cl, apiCommande));
        return new Commande(apiCommande, client);
    }

    get commandesDeLaLivraison(): Commande[] {
        return this._commandes.filter(co => co.apiCommande.livraisonNo === this._stock.apiLivraison.no);
    }

    /**
     * si le site est d'état Ouvert, commandes de la dernière livraison terminée (avec livraisonNo)
     */
    get commandesLivrées(): Commande[] {
        return this._commandes.filter(co => co.apiCommande.livraisonNo > 0);
    }

    /**
     * si le site est d'état Livraison, dernières commandes non-vides de tous les clients d'état Nouveau ou actif (sans livraisonNo)
     */
    get commandesVides(): Commande[] {
        return this._commandes.filter(c => c.détails.length === 0);
    }

    /**
     * si le site est d'état Livraison, dernières commandes non-vides de tous les clients d'état Nouveau ou actif (sans livraisonNo)
     */
    get commandesAlivrer(): Commande[] {
        return this._commandes.filter(c => c.détails.length === 0);
    }

    get commandesParEtat(): {
        aPreparer: Commande[],
        refus: Commande[],
        pret: Commande[],
    } {
        const commandesParEtat = {
            aPreparer: [],
            refus: [],
            pret: []
        };
        this._commandes.forEach(c => {
            commandesParEtat.aPreparer.push(c);
        });
        return commandesParEtat;
    }
}
