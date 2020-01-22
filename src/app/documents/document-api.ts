import { ApiFacture, ApiFactureCommande } from '../fournisseur/factures/facture-api';
import { CatalogueApi } from '../modeles/catalogue/catalogue';

export class ApiDocumentCommande extends ApiFactureCommande {

    /**
     * Catalogue en vigueur à la date du document ne contenant que les produits du document
     * Présent si la commande est chargée pour le document
     */
    catalogue?: CatalogueApi;

    /**
     * Nombre de détails avec demande.
     * Présent si la commande est chargée pour la liste.
     */
    lignesC?: number;

    /**
     * Coût total des détails avec demande.
     * Présent si la commande est chargée pour la liste.
     */
    totalC?: number;

    /**
     * Nombre de détails avec aLivrer.
     * Présent si la commande est chargée pour la liste.
     */
    lignesL?: number;

    /**
     * Coût total des détails avec aLivrer.
     * Présent si la commande est chargée pour la liste.
     */
    totalL?: number;
}

export class ApiBilanProduit {
    no: number;
    quantité: number;
    prix: number;
}

export class ApiDocumentFacture extends ApiFacture {

    /**
     * date de la facture
     */
    date: Date;

    /**
     * Présent si la facture est chargée pour le document
     */
    produits: ApiBilanProduit[];

    /**
     * Catalogue en vigueur à la date du document ne contenant que les produits du document sans les prix
     * Présent si la facture est chargée pour le document
     */
    catalogue?: CatalogueApi;

    /**
     * Nombre de produits
     * Présent si la facture est chargée pour la liste.
     */
    lignes?: number;

    /**
     * Coût total des produits.
     * Présent si la facture est chargée pour la liste.
     */
    total?: number;
}

export class ApiDocuments {
    commandes: ApiDocumentCommande[];
    factures: ApiDocumentFacture[];
}
