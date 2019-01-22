import { Injectable, OnDestroy } from '@angular/core';
import { Site } from '../modeles/site';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationEnd, NavigationStart, ResolveEnd, ResolveStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageDef } from '../commun/page-def';
import { Stockage } from './stockage';
import { AttenteAsyncService } from './attenteAsync.service';
import { SiteDeRoute } from './site-de-route';
import { SiteRoutes } from '../site/site-pages';

@Injectable({
    providedIn: 'root'
})
export class NavigationService implements OnDestroy {

    private _stockageHistorique: Stockage<string[]>;

    private _stockagePageDefs: Stockage<PageDef[]>;

    private _stockageSite: Stockage<Site>;


    private _pageDefSAChangé = new Subject<boolean>();

    private siteAChangé = new Subject<boolean>();

    constructor(
        private _router: Router,
        private _attenteAsync: AttenteAsyncService,
    ) {
        this._stockageHistorique = new Stockage<string[]>('Historique');
        this._stockageHistorique.fixeStock([]);
        this._stockagePageDefs = new Stockage<PageDef[]>('PageDefs', {
            distincts: (p1: PageDef[], p2: PageDef[]) => true,
            action: () => this._pageDefSAChangé.next(true)
        });
        this._stockageSite = new Stockage<Site>('SiteEnCours', {
            distincts: (s1: Site, s2: Site) => s1.uid !== s2.uid,
            action: (): void => this.siteAChangé.next(true)
        });
        this.initialise();
    }

    ngOnDestroy() {
        this._stockageHistorique.initialise();
        this._stockagePageDefs.initialise();
        this._stockageSite.initialise();
    }

    /** appelé par le constructor du AppComponent ? */
    public initialise() {
        this._router.events
            .pipe(filter(event => event instanceof ResolveStart || event instanceof ResolveEnd || event instanceof NavigationEnd))
            .subscribe((event) => {
                if (event instanceof ResolveStart) {
                    this._attenteAsync.commence();
                    return;
                }
                if (event instanceof ResolveEnd) {
                    this._attenteAsync.finit();
                    return;
                }

                const navigationEnd = event as NavigationEnd;

                this._stockageHistorique.fixeStock([...this.historique(), navigationEnd.urlAfterRedirects]);

                let snapshot = this._router.routerState.snapshot.root;
                const pageDefs = [];
                const _pageDef = (objet: any): any => objet._pageDef as PageDef;
                for (let i = 0; snapshot.children.length > 0; i++) {
                    console.log(snapshot);
                    snapshot = snapshot.children[0];
                    const truc = snapshot.component;
                    if (truc) {
                        if (typeof (truc) === 'string') {
                            console.log('RouteSnapshot string', truc);
                        } else {
                            const pageDef: PageDef = _pageDef(truc);
                            if (pageDef) {
                                pageDefs.push(pageDef);
                            }
                        }
                    }
                }
                this._stockagePageDefs.fixeStock(pageDefs);

                const nomSite = SiteRoutes.nomSite(navigationEnd.urlAfterRedirects);
                // le seul changement de site qui n'est pas traité par SiteResolver est un retour à la racine
                if (!nomSite && this._stockageSite) {
                    this.siteEnCours = null;
                }
            });
    }

    public historique(): string[] {
        return this._stockageHistorique.litStock();
    }

    public urlPrécédente(): string {
        const historique = this._stockageHistorique.litStock();
        return historique.length > 1 ? historique[historique.length - 2] : null;
    }

    public routePasseParSite(): boolean {
        const historique = this._stockageHistorique.litStock();
        return historique.length > 0 && !!SiteRoutes.nomSite(historique[historique.length - 1]);
    }

    get siteDeRoute(): Site {
        return SiteDeRoute(this._router.routerState.snapshot.root);
    }

    public get siteEnCours(): Site {
        const site = this._stockageSite.litStock();
        if (site) {
            const siteAvecMéthodes = new Site();
            siteAvecMéthodes.copie(site);
            return siteAvecMéthodes;
        }
    }
    public set siteEnCours(site: Site) {
        this._stockageSite.fixeStock(site);
    }

    get pageDefs(): PageDef[] {
        return this._stockagePageDefs.litStock();
    }

    public changementDeSite(): Observable<boolean> {
        return this.siteAChangé.asObservable();
    }

    public changementDePageDef(): Observable<boolean> {
        return this._pageDefSAChangé.asObservable();
    }
}
