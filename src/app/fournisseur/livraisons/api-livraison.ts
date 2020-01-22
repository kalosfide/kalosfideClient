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
    dateLivraison?: Date;

    /**
     * sinon dernières commandes des clients
     *      si le site n'est pas d'état Livraison,
     *          commandes de la prochaine livraison et celles de la dernière dont le client n'est pas dans la prochaine livraison
     *      sinon,
     *          commandes de la livraison en cours et celles de la précédente dont le client n'est pas dans la livraison en cours
     */
    commandes: ApiCommande[];

    /**
     * date de lecture ou de mise à jour
     */
    date: Date;
}
