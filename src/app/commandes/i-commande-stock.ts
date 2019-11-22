import { Catalogue } from '../modeles/catalogue/catalogue';

export interface ICommandeStock {
    livraisonNo: number;
    dateLivraison: Date;
    etatSite: string;
    catalogue: Catalogue;
}
