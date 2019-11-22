import { Produit, IAvecProduit } from '../modeles/catalogue/produit';

export interface IAvecDemandeProduit extends IAvecProduit {
    demande?: number;
    aLivrer?: number;
    aFacturer?: number;
}
