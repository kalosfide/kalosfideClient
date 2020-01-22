export class BilanLivraison {
    nbClients: number;
    nbProduitsDemandés: number;
    nbDétails: number;
    nbPréparés: number;
    nbSansDétails: number;

    static bilanVide(): BilanLivraison {
        return {
            nbClients: 0,
            nbDétails: 0,
            nbPréparés: 0,
            nbProduitsDemandés: 0,
            nbSansDétails: 0
        };
    }
}
