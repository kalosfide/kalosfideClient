import { PageDef, BaseRoutes } from './commun/page-def';

export class AppPages {
    static appSite: PageDef = {
        urlSegment: 'a',
    };
    static site: PageDef = {
        urlSegment: 's',
    };
    static compte: PageDef = {
        urlSegment: 'compte',
    };
    static introuvable: PageDef = {
        urlSegment: 'introuvable',
        title: 'Introuvable',
        titre: 'Ressources introuvables'
    };
    static interdit: PageDef = {
        urlSegment: 'interdit',
        title: 'Interdit',
        titre: 'Accès refusé'
    };
    static conflit: PageDef = {
        urlSegment: 'conflit',
        title: 'Verrouillé',
        titre: 'Ressources verrouillées'
    };
    static apiErreur: PageDef = {
        urlSegment: 'apiErreur',
        title: 'Erreur',
        titre: 'Erreur du serveur'
    };
    static pasOuvert: PageDef = {
        urlSegment: 'pasOuvert',
        lien: '',
        title: 'Fermé',
        titre: 'Site fermé'
    };
    static administrateur: PageDef = {
        urlSegment: 'administrateur',
    };
    static pageDefs: PageDef[] = [
        AppPages.appSite,
        AppPages.site,
        AppPages.compte,
        AppPages.introuvable,
        AppPages.interdit,
        AppPages.conflit,
        AppPages.apiErreur,
        AppPages.pasOuvert,
        AppPages.administrateur,
    ];
}

class AppRoutesClass extends BaseRoutes {
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
