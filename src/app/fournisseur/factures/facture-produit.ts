import { Produit } from 'src/app/modeles/catalogue/produit';
import { ApiDétailCommandeData } from 'src/app/commandes/api-commande';

export class  FactureProduit {
    produit: Produit;
    aLivrer: number;
    aFacturer: number;

    constructor(produit: Produit, apiDétatilDatas: ApiDétailCommandeData[]) {
        this.produit = produit;
        this.aLivrer = 0;
        this.aFacturer = 0;
        apiDétatilDatas.forEach(d => {
            this.aLivrer += d.aLivrer;
            this.aFacturer += d.aFacturer;
        });
    }
}
