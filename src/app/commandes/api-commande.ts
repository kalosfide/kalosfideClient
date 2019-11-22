import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { KeyUidRnoNo2 } from '../commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';

/**
 * reproduit l'objet Commande de l'Api en supprimant les élements de clé du détail qui sont ceux de la commande
 * la clé est celle de la commande
 */
export class ApiCommande extends KeyUidRnoNo {

    /**
     * Date de la commande fixée quand la livraison est terminée à la date du dernier détail créé par le client
     * s'il y en a, à la date de la livraison sinon
     */
    date?: Date;

    /**
     * présent si la livraison est en cours ou terminée
     * */
    livraisonNo?: number;

    /**
     * présent si la facturation est terminée
     * */
    factureNo?: number;

    details: ApiDétailCommandeData[];

    static ouverte(apiCommande: ApiCommande): boolean {
        return !!apiCommande && !apiCommande.livraisonNo;
    }

    static terminée(apiCommande: ApiCommande): boolean {
        return !!apiCommande && !!apiCommande.livraisonNo && !!apiCommande.date;
    }

    static traitée(apiCommande: ApiCommande): boolean {
        return !!apiCommande && !!apiCommande.livraisonNo && !apiCommande.date;
    }

    static refusée(apiCommande: ApiCommande): boolean {
        return !!apiCommande && !!apiCommande.livraisonNo && !!apiCommande.date // terminée
            && apiCommande.details.find(d => d.aLivrer > 0) === undefined;
    }
}

/**
 * reproduit l'objet DétailCommandeVue de l'Api
 * la clé est celle du détail
 */
export class ApiDétailCommande extends KeyUidRnoNo2 {
    /** vrai si le détail a été ajouté par un client avec compte */
    date?: Date;
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
    /** présent si le détail a été ajouté par un client avec compte */
    date?: Date;

    typeCommande?: string;
    demande?: number;
    aLivrer?: number;
    aFacturer?: number;
}
