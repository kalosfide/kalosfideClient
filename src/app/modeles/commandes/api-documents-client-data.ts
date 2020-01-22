import { ApiDocument } from './api-document';

/**
 * Contient les données d'un client
 * Objet lu dans l'Api
 */
export class ApiDocumentsData {

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    commandes: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    livraisons: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    factures: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une édition ou une vue.
     * Pour une vue, contient seulement le document à visualiser.
     * Quand un client va créer ou éditer une commande, contient seulement la dernière commande non refusée.
     * Quand le fournisseur va créer ou éditer le bon de livraison d'un client, contient les commandes de ce client
     * avec date et sans numéro de livraison (il peut y en avoir plusieurs) ou s'il n'y en a pas, la dernière livraison.
     * Quand le fournisseur va créer ou éditer la facture d'un client, contient les livraisons de ce client
     * avec date sans numéro de facture
     */
    documents: ApiDocument[];

}
