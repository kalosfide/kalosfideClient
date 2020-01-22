import { ISiteRoutes } from '../../site/site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { CommandePagesUrlSegments } from 'src/app/commandes/commande-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

export class LivraisonPages {
    /**
     * Sélection du client à livrer
     * table des clients avec leurs nombres de bons de commande et des liens vers client
     */
    static clients: PageDef = {
        urlSegment: 'clients',
        title: 'Clients',
    };

    /**
     * Sélection des bons de commande du client à livrer
     * table des bons de commande du client avec case de sélection
     * lien ajouter
     * bouton commencer
     */
    static client: PageDef = {
        urlSegment: 'client',
        title: 'Client',
    };

    /**
     * tables des bons de commande des clients
     */
    static commandes: PageDef = {
        urlSegment: 'commandes',
        lien: 'Retour aux bons de commande',
        title: 'Commandes',
        titre: 'Commandes',
    };

    static choixClient: PageDef = {
        urlSegment: 'ajoute',
        title: 'Livraison - Commandes',
        titre: 'Choix du client',
    };

    /**
     * table des détails d'une commande
     */
    static commande: PageDef = {
        urlSegment: 'commande',
        title: 'Livraison - Commande',
        titre: 'Bon de commande',
    };
    static liste: PageDef = {
        urlSegment: CommandePagesUrlSegments.liste,
        lien: 'Retour au bon de commande',
        title: 'Bon',
        titre: 'Bon de commande',
    };
    static choixProduit: PageDef = {
        urlSegment: CommandePagesUrlSegments.choixProduit,
        title: 'Choix produit',
        titre: 'Choisir un produit',
    };
    static ajoute: PageDef = {
        urlSegment: CommandePagesUrlSegments.ajoute,
        title: 'Ajoute',
        titre: 'Ajouter un produit',
    };
    static edite: PageDef = {
        urlSegment: CommandePagesUrlSegments.edite,
        title: 'Edite',
        titre: 'Modifier la ligne',
    };
    static supprime: PageDef = {
        urlSegment: CommandePagesUrlSegments.supprime,
        title: 'Supprime',
        titre: 'Supprimer la ligne',
    };
    static annule: PageDef = {
        urlSegment: CommandePagesUrlSegments.annule,
        title: 'Annule',
        titre: 'Annuler la commande',
    };

    static apercu: PageDef = {
        urlSegment: 'apercu',
        title: 'Commande',
        titre: 'Bon de commande',
    };

    /**
     * table des bilans par produit
     */
    static produits: PageDef = {
        urlSegment: 'produits',
        lien: 'Produits demandés',
        title: 'Livraison',
        titre: 'Produits demandés',
    };

    /**
     * table des détails demandant un produit
     */
    static produit: PageDef = {
        urlSegment: 'produit',
        title: 'Livraison - Produit',
        titre: 'Produit',
    };

    /**
     * edition d'une ligne de commande
     */
    static detail: PageDef = {
        urlSegment: 'detail',
        title: 'Livraison - Détail',
        titre: 'Modifier la commande',
    };

    static termine: PageDef = {
        urlSegment: 'termine',
        lien: 'Terminer la livraison',
        title: 'Livraison',
        titre: 'Bon de commande transmis',
    };
}

class CLivraisonCommandeRoutes extends BaseRoutes implements ISiteRoutes {
    texteKey: string;
    livraisonRoutes: CLivraisonRoutes;

    constructor(ikeyClient: IKeyUidRno, livraisonRoutes: CLivraisonRoutes) {
        super();
        this.texteKey = KeyUidRno.texteDeKey(ikeyClient);
        this.livraisonRoutes = livraisonRoutes;
    }
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(LivraisonPages.commande.urlSegment, this.texteKey);
        s = s.concat(segments);
        return this.livraisonRoutes.url(nomSite, s);
    }
}

class CLivraisonProduitRoutes extends BaseRoutes implements ISiteRoutes {
    texteKey: string;
    livraisonRoutes: CLivraisonRoutes;

    constructor(noProduit: number, livraisonRoutes: CLivraisonRoutes) {
        super();
        this.texteKey = '' + noProduit;
        this.livraisonRoutes = livraisonRoutes;
    }
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(LivraisonPages.produit.urlSegment, this.texteKey);
        s = s.concat(segments);
        return this.livraisonRoutes.url(nomSite, s);
    }
}

class CLivraisonRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(FournisseurPages.livraison.urlSegment);
        s = s.concat(segments);
        return FournisseurRoutes.url(nomSite, s);
    }

    commandeRoutes(ikeyClient: IKeyUidRno): CLivraisonCommandeRoutes {
        return new CLivraisonCommandeRoutes(ikeyClient, this);
    }

    produitRoutes(noProduit: number): ISiteRoutes {
        return new CLivraisonProduitRoutes(noProduit, this);
    }
}
export const LivraisonRoutes = new CLivraisonRoutes();
