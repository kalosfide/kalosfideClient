import { AppPages, AppRoutes } from '../app-pages';
import { Identifiant } from '../securite/identifiant';
import { TypesRoles } from '../securite/type-role';
import { strictEqual } from 'assert';
import { FournisseurRoutes } from '../fournisseur/fournisseur-pages';
import { ClientRoutes } from '../client/client-pages';
import { VisiteurRoutes } from '../visiteur/visiteur-pages';

export const SitePages = {
    fournisseur: {
        urlSegment: TypesRoles.fournisseur,
    },
    client: {
        urlSegment: TypesRoles.client,
    },
    visiteur: {
        urlSegment: TypesRoles.visiteur,
    },
    accueil: {
        urlSegment: 'accueil',
        lien: '',
        title: 'Accueil',
    },
    // pages de plusieurs menus
    produits: {
        urlSegment: 'produits',
        lien: 'Produits',
        title: 'Produits',
    },
    /* à supprimer - début */
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
    gestion: {
        urlSegment: 'gestion',
        lien: 'Gestion',
        title: 'Gestion',
    },
    /* à supprimer - fin */
    contact: {
        urlSegment: 'contact',
        lien: 'Contact',
        title: 'Contact',
    },
    apropos: {
        urlSegment: 'apropos',
        lien: 'A propos',
        title: 'A propos',
    },
};

export interface ISiteRoutes {
    url: (nomSite: string, segments?: string[]) => string;
}

class CSiteRoutes implements ISiteRoutes {
    url(nomSite: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, nomSite);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    urlRole(nomSite: string, typeRole: string, segments?: string[]): string {
        let s: string[] = [];
        s.push(AppPages.site.urlSegment, nomSite, typeRole);
        if (segments && segments.length > 0) {
            s = s.concat(segments);
        } else {
            s.push(SitePages.accueil.urlSegment);
        }
        return AppRoutes.url(s);
    }
    urlSite(nomSite: string, identifiant: Identifiant, segments?: string[]): string {
        const typeRole: string = identifiant
            ? identifiant.estFournisseurDeNomSite(nomSite)
                ? SitePages.fournisseur.urlSegment
                : identifiant.estUsagerDeNomSite(nomSite)
                    ? SitePages.client.urlSegment
                    : SitePages.visiteur.urlSegment
            : SitePages.visiteur.urlSegment;
        return this.urlRole(nomSite, typeRole, segments);
    }

    /**
     * retourne le nom du site si la route passe par un site
     * @param routeUrl url à examiner
     */
    nomSite(routeUrl: string): string {
        const segments = routeUrl.split(AppRoutes.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            return segments[2];
        }
    }

    /**
     * retourne un array de string
     * [0] nom du site si la route passe par un site
     * [1] préfixe de l'identifiant s'il y un site (Visiteur par défaut)
     * @param routeUrl url à examiner
     */
    nomSite_Base(routeUrl: string): string[] {
        const segments = routeUrl.split(AppRoutes.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            const nomSite_Base = [segments[2]];
            if (segments.length > 3) {
                const segmentBase = segments[3];
                if (segmentBase === SitePages.fournisseur.urlSegment
                    || segmentBase === SitePages.client.urlSegment
                    || segmentBase === SitePages.visiteur.urlSegment
                ) {
                    nomSite_Base.push(segmentBase);
                }
            } else {
                nomSite_Base.push(SitePages.visiteur.urlSegment);
            }
            return nomSite_Base;
        }
    }

    /**
     * retourne un array de string
     * [0] nom du site si la route passe par un site
     * [1] préfixe de l'identifiant s'il y un site (Visiteur par défaut)
     * [2] urlSegment s'il y un site (Accueil par défaut)
     * @param routeUrl url à examiner
     */
    nomSite_typeRole_page(routeUrl: string): {
        nomSite: string,
        typeRole: string,
        page: string,
    } {
        const segments = routeUrl.split(AppRoutes.séparateur);
        if (segments.length > 2 && segments[1] === AppPages.site.urlSegment) {
            const nomSite = segments[2];
            let typeRole: string = SitePages.visiteur.urlSegment;
            let page: string = SitePages.accueil.urlSegment;
            if (segments.length > 3) {
                typeRole = segments[3];
                if (typeRole === SitePages.fournisseur.urlSegment
                    || typeRole === SitePages.client.urlSegment
                    || typeRole === SitePages.visiteur.urlSegment
                ) {
                    if (segments.length > 4) {
                        page = segments[4];
                    }
                }
            }
            return {
                nomSite: nomSite,
                typeRole: typeRole,
                page: page
            };
        }
    }
}
export const SiteRoutes = new CSiteRoutes();
