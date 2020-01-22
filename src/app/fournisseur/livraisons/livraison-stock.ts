import { ApiLivraison } from './api-livraison';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { ICommandeStock } from 'src/app/commandes/i-commande-stock';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ApiCommande, ApiDétailCommandeData } from 'src/app/commandes/api-commande';
import { BilanLivraison } from './livraison-etat';
import { Client } from 'src/app/modeles/client/client';

export class LivraisonStock implements ICommandeStock {
    apiLivraison: ApiLivraison;
    catalogue: Catalogue;
    clients: Client[];
    etatSite: string;
    bilan: BilanLivraison;

    constructor(
        apiLivraison: ApiLivraison,
        etatSite: string,
        catalogue?: Catalogue,
        clients?: Client[],
        bilan?: BilanLivraison,
    ) {
        this.apiLivraison = apiLivraison;
        this.etatSite = etatSite;
        this.catalogue = catalogue;
        this.clients = clients;
        if (bilan) {
            this.bilan = bilan;
        } else {
            if (catalogue) {
                this.créeBilan();
            }
        }
    }

    get livraisonNo(): number {
        return this.apiLivraison.no;
    }

    get dateLivraison(): Date {
        return this.apiLivraison.dateLivraison;
    }

    get dateStock(): Date {
        return new Date(this.apiLivraison.date);
    }

    get keySite(): KeyUidRno {
        return {
            uid: this.apiLivraison.uid,
            rno: this.apiLivraison.rno
        };
    }

    /**
     * si le site est d'état Livraison, dernières commandes des clients avec un livraisonNo égal à this.livraisonNo
     * sinon, dernières commandes des clients sans livraisonNo
     */
    get apiCommandesATraiter(): ApiCommande[] {
        return this.apiLivraison.commandes
            .filter(apiCommande => !apiCommande.livraisonNo // avant traitement
                || apiCommande.livraisonNo === this.apiLivraison.no // pendant traitement
            );
    }

    /**
     * dernières commandes des clients avec un livraisonNo strictement inférieur à this.livraisonNo
     */
    get apiCommandesACopier(): ApiCommande[] {
        return this.apiLivraison.commandes
            .filter(apiCommande => apiCommande.livraisonNo
                && apiCommande.livraisonNo < this.apiLivraison.no // déjà traitée
            );
    }

    /**
     * remplace les commandes stockées par les commandes reçues
     * @param commandesRecues commandes des clients avec compte reçues depuis que le stock a été chargé ou rafraichi
     * @param date date du rafraichissement
     */
    rafraichit(commandesRecues: ApiCommande[], date: Date) {
        this.apiLivraison.date = date;
        commandesRecues.forEach(reçue => {
            const index = this.apiLivraison.commandes.findIndex(c => c.uid === reçue.uid && c.rno === reçue.rno);
            if (index !== -1) {
                this.apiLivraison.commandes.splice(index, 1, reçue);
            }
        });
    }

    créeBilan(): BilanLivraison {
        let àTraiter = this.apiCommandesATraiter;
        if (!àTraiter) {
            return BilanLivraison.bilanVide();
        }
        const nbATraiter = àTraiter.length;
        àTraiter = àTraiter.filter(c => c.details.length > 0);
        const nbClients = àTraiter.length;
        let détails: ApiDétailCommandeData[] = [];
        àTraiter.forEach(c => détails = détails.concat(c.details));
        this.bilan = {
            nbClients: nbClients,
            nbSansDétails: nbATraiter - nbClients,
            nbDétails: détails.length,
            nbPréparés: détails.filter(d => d.aLivrer !== null && d.aLivrer !== undefined).length,
            nbProduitsDemandés: this.catalogue.produits.filter(p => détails.findIndex(d => d.no === p.no) !== -1).length
        };
        return this.bilan;
    }

}
