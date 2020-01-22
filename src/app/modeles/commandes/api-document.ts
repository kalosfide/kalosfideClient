import { CatalogueApi } from '../catalogue/catalogue';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ApiLigneData } from './api-ligne-data';

/**
 * Contient les données d'un document.
 */
export class ApiDocument {

    /**
     * Présent quand le document fait partie d'une liste.
     * Ajouté quand le document est créé sinon.
     * Présent quand le document est envoyé.
     */
    uid: string;

    /**
     * Présent quand le document fait partie d'une liste.
     * Ajouté quand le document est créé sinon.
     * Présent quand le document est envoyé.
     */
    rno: number;

    /**
     * Présent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Présent quand le document est envoyé si c'est une commande.
     * COMMANDE: No de la commande incrémenté par client.
     * LVRAISON, FACTURE: No incrémenté par site. Fixé quand le document est enregistré.
     */
    no: number;

    /**
     * Présent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Absent quand le document est envoyé.
     * COMMANDE: Date de la commande.
     * Fixée quand le bon de commande est envoyé si la commande a été créée par le client.
     * Sinon, égale à DATE_NULLE puis fixée à la date de la livraison quand le bon de livraison est envoyé.
     */
    date?: Date;

    /**
     * Présent quand le document a été traité dans un parent qui a été envoyé.
     * Absent quand le document est envoyé.
     */
    parentNo?: number;

    /**
     * Absent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse si certaines des lignes concernent des produits qui ont changé
     * par rapport au catalogue en vigueur et contient seulement l'ancien état des produits changés.
     * Présent si le document est chargé pour une vue et contient seulement les produits des lignes du document.
     * Absent quand le document est envoyé.
     */
    tarif?: CatalogueApi;

    /**
     * Absent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Présent quand le document est envoyé s'il s'agit d'une synthèse.
     */
    lignes?: ApiLigneData[];

    /**
     * Présent quand le document fait partie d'une liste.
     * Absent quand le document est envoyé.
     */
    nbLignes?: number;

    /**
     * Coût total du document
     * Présent quand le document fait partie d'une liste.
     * Absent quand le document est envoyé.
     */
    total?: number;

    /**
     * Présent et vrai quand le document fait partie d'une liste si le total est incomplet.
     * Absent quand le document est envoyé.
     */
    incomplet?: boolean;
}
