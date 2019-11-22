import { ApiCommande } from 'src/app/commandes/api-commande';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ICommandeStock } from 'src/app/commandes/i-commande-stock';

/**
 * contient la clé de la dernière livraison et les dernières commandes de tous les clients d'état Nouveau ou actif d'un site
 * la clé est celle de la livraison à livrer
 */
export class ApiLivraison {
    /**
     * uid du site et de toutes ses livraisons
     */
    uid: string;

    /**
     * rno du site et de toutes ses livraisons
     */
    rno: number;

    /**
     * s'il n'y a jamais eu de livraison, 1
     * sinon no de la dernière livraison + 1
     */
    no: number;

    /**
     * s'il n'y a jamais eu de livraison, indéfini
     * sinon
     *      si le site est d'état Livraison, indéfini
     *      sinon, date de la dernière livraison
     */
    date?: Date;

    /**
     * s'il n'y a jamais eu de livraison, indéfini
     * sinon dernières commandes des clients
     *      si le site n'est pas d'état Livraison, commandes de la dernière livraison
     *      sinon, commandes de la livraison en cours et celles de la précédente dont le client n'est pas dans la dernière livraison
     */
    commandes?: ApiCommande[];

    /**
     * si le site est d'état Livraison, indéfini
     * sinon, commandes non-vides sans livraisonNo
     */
    enAttente?: ApiCommande[];

    /**
     * si le site est d'état Livraison, dernières commandes des clients avec un livraisonNo égal à this.livraisonNo
     * sinon, dernières commandes des clients sans livraisonNo
     */
    aTraiter?: ApiCommande[];

    /**
     * dernières commandes des clients avec un livraisonNo strictement inférieur à this.livraisonNo
     */
    aCopier?: ApiCommande[];
}
