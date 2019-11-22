import { DetailCommande } from 'src/app/commandes/detail-commande';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/clientele/client';

export class FactureDétail extends DetailCommande {
    constructor(
        apiCommande: ApiCommande,
        produit: Produit,
        client: Client,
    ) {
        super(apiCommande, produit, {
            client: client,
            estDansFacture: true
        });
    }
}
