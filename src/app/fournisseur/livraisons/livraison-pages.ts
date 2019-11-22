import { ISiteRoutes } from '../../site/site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { texteKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';

export class LivraisonPages {

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

    static choixProduit: PageDef = {
        urlSegment: CommandePages.choixProduit.urlSegment,
        title: 'Commander _' + CommandePages.choixProduit.title,
        titre: CommandePages.choixProduit.titre,
    };

    static efface: PageDef = {
        urlSegment: 'efface',
        title: 'Livraison - Commande',
        titre: 'Effacer le bon de commande',
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
        this.texteKey = texteKeyUidRno(ikeyClient);
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
