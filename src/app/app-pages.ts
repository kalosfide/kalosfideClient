import { PageDef } from './commun/page-def';
import { isArray } from 'util';

export const keySéparateur = '/';

export const AppPages = {
    appSite: {
        urlSegment: 'a',
    },
    site: {
        urlSegment: 's',
    },
    compte: {
        urlSegment: 'compte',
    },
    introuvable: {
        urlSegment: 'introuvable',
        title: 'Introuvable',
        titre: 'Ressources introuvables'
    },
    interdit: {
        urlSegment: 'interdit',
        title: 'Interdit',
        titre: 'Accès refusé'
    },
    conflit: {
        urlSegment: 'conflit',
        title: 'Verrouillé',
        titre: 'Ressources verrouillées'
    },
    apiErreur: {
        urlSegment: 'apiErreur',
        title: 'Erreur',
        titre: 'Erreur du serveur'
    },
    pasOuvert: {
        urlSegment: 'pasOuvert',
        lien: '',
        title: 'Fermé',
        titre: 'Site fermé'
    },
    administrateur: 'administrateur',
};

export class AppRoutes {
    public static séparateur = '/';

    private static _images = '/assets';

    static urlIntrouvable = AppPages.appSite.urlSegment + AppRoutes.séparateur + AppPages.introuvable.urlSegment;

    static éclateString(s: string): string[] {
        return s.split(AppRoutes.séparateur);
    }

    static éclateStrings(ss: any[]): string[] {
        const strings: string[] = [];
        ss.forEach(s => {
            if (typeof(s) === 'string') {
                strings.concat(AppRoutes.éclateString(s));
            }
        });
        return strings;
    }
    static url(segments?: string[]): string {
        let u = AppRoutes.séparateur;
        if (segments) {
            u += segments.join(AppRoutes.séparateur);
        }
        return u;
    }

    static urlImage(...segments: string[]): string {
        return AppRoutes._images + AppRoutes.séparateur + segments.join(AppRoutes.séparateur);
    }

}
