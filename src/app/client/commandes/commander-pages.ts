import { SitePages, ISiteRoutes } from 'src/app/site/site-pages';
import { ClientRoutes } from 'src/app/client/client-pages';
import { PageDef, BaseRoutes } from 'src/app/commun/page-def';
import { CommandePagesUrlSegments } from 'src/app/commandes/commande-pages';

export class CommanderPages {
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
    static contexte: PageDef = {
        urlSegment: 'contexte',
        title: 'Commandes',
        titre: 'Commandes',
    };
     static accueil: PageDef = {
        urlSegment: 'accueil',
        title: 'Commande',
        titre: 'Commandes',
    };
    static termine: PageDef = {
        urlSegment: 'termine',
        title: 'Termine',
        titre: 'Bon de commande transmis',
    };
}

class CCommanderRoutes extends BaseRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(SitePages.commandes.urlSegment);
        s = s.concat(segments);
        return ClientRoutes.url(nomSite, s);
    }
}
export const CommanderRoutes = new CCommanderRoutes();
