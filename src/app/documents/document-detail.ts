import { DetailCommande } from '../commandes/detail-commande';
import { ApiDocumentCommande } from './document-api';
import { Produit, IAvecProduit } from '../modeles/catalogue/produit';
import { IDocumentLigne } from './document';

export class DocumentDétail extends DetailCommande implements IAvecProduit, IDocumentLigne {
    constructor(apiCommande: ApiDocumentCommande, produit: Produit) {
        super(apiCommande, produit);
    }
}
