import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Client } from 'src/app/modeles/clientele/client';
import { ApiCommande } from 'src/app/commandes/api-commande';

export class ApiFacture extends KeyUidRno {
    /**
     * uid du client
     */
    uid: string;

    /**
     * rno du client
     */
    rno: number;

    factureNo: number;

    /**
     * commandes à facturer sans keyClient
     */
    commandes: ApiFactureCommande[];
}

export class ApiFactureCommande extends ApiCommande {
    /**
     * date de la livraison
     */
    dateLivraison: Date;
}

export class ApiFactureLivraison {
    no: number;
    date: Date;
}

export class ApiFactures {
    /**
     * Liste des listes des commandes livrées non facturées regroupées par client
     */
    factures: ApiFacture[];

    /**
     * Liste des No et Date des livraisons des commandes livrées non facturées
     */
    livraisons: ApiFactureLivraison[];

    /**
     * Numéro de la prochaine facture
     */
    noProchaineFacture: number;
}
