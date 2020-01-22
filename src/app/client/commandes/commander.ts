import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { ICommandeStock } from 'src/app/commandes/i-commande-stock';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { Site } from 'src/app/modeles/site/site';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IdEtatProduit } from 'src/app/modeles/catalogue/etat-produit';

/**
 * contient le contexte pour la commande
 * la clé est celle la livraison en cours du site
 */
export class ApiContexteCommande {

    /**
     * no de la dernière livraison
     */
    noLivraison: number;

    /**
     * date de la dernière livraison,
     * indéfinie s'il n'y a jamais eu de livraison ou si le site est d'état Livraison
     */
    dateLivraison?: Date;

    /**
     * état du site
     */
    etatSite: IdEtatSite;

    /**
     * date du catalogue
     */
    dateCatalogue: Date;

    /**
     * no dernière commande
     */
    noDC?: number;
}

/**
 * contient le contexte pour la commande et les données definissant la commande
 */
export class CommanderStock implements ICommandeStock {
    /**
     * contexte pour commander
     */
    contexte: ApiContexteCommande;

    /**
     * données definissant la dernière commande du client
     */
    commande: ApiCommande;

    /**
     * key du site en cours à la création du stock
     * comparé au Site en cours à chaque lecture du stock pour mettre à jour le stock si changé
     */
    keyIdentifiant: IKeyUidRno;

    /**
     * key du site en cours à la création du stock
     * comparé au Site en cours à chaque lecture du stock pour mettre à jour le stock si changé
     */
    keySite: IKeyUidRno;

    catalogue: Catalogue;

    constructor(keySite: IKeyUidRno, keyIdentifiant: IKeyUidRno,
        contexte: ApiContexteCommande, commande: ApiCommande, catalogue?: Catalogue
    ) {
        this.keySite = keySite;
        this.keyIdentifiant = keyIdentifiant;
        this.catalogue = catalogue;
        this.contexte = contexte;
        this.commande = commande;
    }

    /**
     * no de la dernière livraison
     */
    get livraisonNo(): number { return this.contexte.noLivraison; }

    /**
     * no de la dernière livraison
     */
    get dateLivraison(): Date { return this.contexte.dateLivraison; }

    /**
     * fixé à partir de ApiCommandes.etatS à la création du stock
     * comparé à ApiEtatCommander lu dans l'API à chaque lecture du stock pour mettre à jour le stock si changé
     */
    get etatSite(): string { return this.contexte.etatSite; }

    /**
     * fixé à partir de ApiCommandes.dateC à la création du stock
     * comparé à ApiEtatCommander lu dans l'API à chaque lecture du stock pour mettre à jour le stock si changé
     * présent si client
     */
    get dateCatalogue(): Date { return new Date(this.contexte.dateCatalogue); }
}
