import { SitePages } from '../../site/site-pages';
import { ClientRoutes } from '../../client/client-pages';

export const CommandePages = {
    termine: {
        urlSegment: 'termine',
        lien: 'Envoyer le bon de commande',
        title: 'Commande',
        titre: 'Bon de commande transmis',
    },
    envoi: {
        urlSegment: 'envoi',
        lien: 'Retour au bon de commande',
        title: 'Commande',
        titre: 'Bon de commande',
    },
    produits: {
        urlSegment: 'produits',
        lien: 'Choisir des produits',
        title: 'Commande',
        titre: 'Choisir des produits',
    },
};

export class CommandeRoutes {
    static url(nomSite: string, ...segments: string[]): string {
        let s: string[] = [];
        s.push(SitePages.commandes.urlSegment);
        s = s.concat(segments);
        return ClientRoutes.url(nomSite, s);
    }
}
