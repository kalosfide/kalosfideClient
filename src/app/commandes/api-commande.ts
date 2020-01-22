import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { KeyUidRnoNo2 } from '../commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { CatalogueApi } from '../modeles/catalogue/catalogue';

/**
 * reproduit l'objet Commande de l'Api en supprimant les élements de clé du détail qui sont ceux de la commande
 * la clé est celle de la commande
 */
export class ApiCommande {

    uid: string;
    rno: number;
    no: number;
    /**
     * Date de la commande.
     * Fixée quand le bon de commande est envoyé si la commande a été créée par le client.
     * Egale à DATE_NULLE puis fixée à la date de la livraison quand le bon de livraison est envoyé.
     */
    date?: Date;

    /**
     * Présent si la commande a été envoyée par le client à une date antérieure à celle du catalogue en vigueur et si certains des produits
     * demandés dans la commande ont changé. Contient seulement l'ancien état des produits changés.
     */
    tarif?: CatalogueApi;

    /**
     * présent si la livraison est en cours ou terminée
     * */
    livraisonNo?: number;
    /**
     * présent si la livraison est terminée
     */
    dateLivraison?: Date;

    details: ApiDétailCommandeData[];
}

/**
 * reproduit l'objet DétailCommandeVue de l'Api
 * la clé est celle du détail
 */
export class ApiDétailCommande extends KeyUidRnoNo2 {
    typeCommande?: string;
    demande?: number;
    aLivrer?: number;
    aFacturer?: number;
}

/**
 * contient les données d'un DétailCommande de l'Api à regrouper par Commande
 * uid et rno sont absents car ce sont ceux du site
 */
export class ApiDétailCommandeData {
    /** no du produit */
    no: number;

    typeCommande?: string;
    demande?: number;
    aLivrer?: number;
    aFacturer?: number;
}
