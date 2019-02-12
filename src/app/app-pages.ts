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

class AppRoutesClass {
    séparateur = '/';

    private _images = '/assets';

    urlIntrouvable = AppPages.appSite.urlSegment + this.séparateur + AppPages.introuvable.urlSegment;

    éclateString(s: string): string[] {
        return s.split(this.séparateur);
    }

    éclateStrings(ss: any[]): string[] {
        const strings: string[] = [];
        ss.forEach(s => {
            if (typeof(s) === 'string') {
                strings.concat(this.éclateString(s));
            }
        });
        return strings;
    }
    url(segments?: string[]): string {
        let u = this.séparateur;
        if (segments) {
            u += segments.join(this.séparateur);
        }
        return u;
    }

    urlImage(...segments: string[]): string {
        return this._images + this.séparateur + segments.join(this.séparateur);
    }

}

export const AppRoutes = new AppRoutesClass();
