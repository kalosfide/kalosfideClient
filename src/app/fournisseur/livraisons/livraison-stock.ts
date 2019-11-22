import { ApiLivraison } from './api-livraison';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { ICommandeStock } from 'src/app/commandes/i-commande-stock';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ApiCommande, ApiDétailCommandeData } from 'src/app/commandes/api-commande';
import { BilanLivraison } from './livraison-etat';

export class LivraisonStock implements ICommandeStock {
    apiLivraison: ApiLivraison;
    catalogue: Catalogue;
    etatSite: string;
    bilan: BilanLivraison;

    constructor(
        apiLivraison: ApiLivraison,
        etatSite: string,
        catalogue?: Catalogue,
        bilan?: BilanLivraison,
    ) {
        this.apiLivraison = apiLivraison;
        this.etatSite = etatSite;
        this.catalogue = catalogue;
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
        return this.apiLivraison.date;
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
        if (this.apiLivraison.commandes) {
            return this.apiLivraison.commandes
                .filter(apiCommande => !apiCommande.livraisonNo // avant traitement
                    || apiCommande.livraisonNo === this.apiLivraison.no // pendant traitement
                );
        }
    }

    /**
     * dernières commandes des clients avec un livraisonNo strictement inférieur à this.livraisonNo
     */
    get apiCommandesACopier(): ApiCommande[] {
        if (this.apiLivraison.commandes) {
            return this.apiLivraison.commandes
                .filter(apiCommande => apiCommande.livraisonNo
                    && apiCommande.livraisonNo < this.apiLivraison.no // déjà traitée
                );
        }
    }

    static bilanVide(): BilanLivraison {
        return {
            nbClients: 0,
            nbDétails: 0,
            nbPréparés: 0,
            nbProduitsDemandés: 0,
            nbSansDétails: 0
        };
    }

    créeBilan(): BilanLivraison {
        let àTraiter = this.apiCommandesATraiter;
        if (!àTraiter) {
            return LivraisonStock.bilanVide();
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
