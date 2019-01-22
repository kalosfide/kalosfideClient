import { SiteRoutes, SitePages, ISiteRoutes } from '../site/site-pages';

export const FournisseurPages = {
    accueil: {
        urlSegment: SitePages.accueil.urlSegment,
        lien: '',
        title: 'Accueil',
    },
    produits: {
        urlSegment: 'produits',
        lien: 'Produits',
        title: 'Produits',
    },
    commandes: {
        urlSegment: 'commandes',
        lien: 'Commandes',
        title: 'Commandes',
    },
    livraisons: {
        urlSegment: 'livraisons',
        lien: 'Livraisons',
        title: 'Livraisons',
    },
    factures: {
        urlSegment: 'factures',
        lien: 'Factures',
        title: 'Factures',
    },
    documents: {
        urlSegment: 'documents',
        lien: 'Documents',
        title: 'Documents',
        titre: 'Documents',
    },
    site: {
        urlSegment: 'site',
        lien: 'Site',
        title: 'Site',
        titre: 'Site',
    },
    // choix accepter/refuser pour chaque bon de commande
    // tous les acceptés sont affectés à une nouvelle livraison
    // impossible s'il y a des bons de commande acceptés sans bon de livraison
    // transfert des données d'un seul coup
    reception: {
        urlSegment: '',
        lien: '',
        title: '',
        titre: '',
    },
    // fixe les ALivrer des commandes
    preparation: {
        urlSegment: '',
        lien: '',
        title: '',
        titre: '',
    },
};

class CFournisseurRoutes implements ISiteRoutes {
    url(nomSite: string, segments: any[]): string {
        return SiteRoutes.urlRole(nomSite, SitePages.fournisseur.urlSegment, segments);
    }
}
export const FournisseurRoutes = new CFournisseurRoutes();
