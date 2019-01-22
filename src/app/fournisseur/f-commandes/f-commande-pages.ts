import { SitePages } from '../../site/site-pages';
import { FournisseurRoutes } from '../fournisseur-pages';

export const FCommandePages = {
    reception: {
        urlSegment: 'reception',
        lien: 'Choisir les bons',
        title: 'Commande',
        titre: 'Reception des bons de commande',
    },
};

export class FCommandeRoutes {
    static url(nomSite: string, ...segments: string[]): string {
        let s: string[] = [];
        s.push(SitePages.commandes.urlSegment);
        s = s.concat(segments);
        return FournisseurRoutes.url(nomSite, s);
    }
}
