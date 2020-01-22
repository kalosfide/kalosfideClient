import { Injectable, OnDestroy } from '@angular/core';
import { Site } from '../modeles/site/site';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationEnd, NavigationStart, ResolveEnd, ResolveStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageDef } from '../commun/page-def';
import { AttenteService } from './attente.service';
import { SiteRoutes } from '../site/site-pages';
import { StockageService } from './stockage/stockage.service';
import { Stockage } from './stockage/stockage';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';

@Injectable({
    providedIn: 'root'
})
export class NavigationService implements OnDestroy {

    private _stockageHistorique: Stockage<string[]>;

    private _stockagePageDefs: Stockage<PageDef[]>;

    private _stockageSite: Stockage<Site>;

    private _historiqueAChangé = new Subject<boolean>();

    private _pageDefSAChangé = new Subject<boolean>();

    private _siteSubject = new Subject<Site>();

    private _keySiteSubject = new Subject<Site>();

    private _actionsAprèsNavigation: (() => void)[] = [];
    private _actionsAprèsNavigationCommencées: boolean;

    constructor(
        private _router: Router,
        _stockageService: StockageService,
        private _attenteService: AttenteService,
    ) {
        this._stockageHistorique = _stockageService.nouveau<string[]>('Historique', {
            rafraichit: 'aucun',
        });
        this._stockagePageDefs = _stockageService.nouveau<PageDef[]>('PageDefs', {
            rafraichit: 'aucun',
            quandStockChange: () => {
                this._pageDefSAChangé.next(true);
            }
        });
        this._stockageSite = _stockageService.nouveau<Site>('SiteEnCours', {
            quandStockChange: (ancien: Site, nouvau: Site): void => {
                if (!Site.compare(ancien, nouvau)) {
                    this._siteSubject.next(nouvau);
                    const keyInchangé = !ancien
                        ? !nouvau
                        : !!nouvau && ancien.uid === nouvau.uid && ancien.rno === nouvau.rno;
                    if (!keyInchangé) {
                        this._keySiteSubject.next();
                    }
                }
            },
            rafraichit: 'déclenche',
            doitRéinitialiser: this._keySiteSubject.asObservable()
        });
        this.initialise();
    }

    get attenteService(): AttenteService { return this._attenteService; }

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

                const navigationEnd = event as NavigationEnd;

                this._stockageHistorique.fixeStock([...this.historique(), navigationEnd.urlAfterRedirects]);
                this._historiqueAChangé.next(true);

                let snapshot = this._router.routerState.snapshot.root;
                const pageDefs = [];
                const _pageDef = (objet: any): any => objet._pageDef as PageDef;
                for (let i = 0; snapshot.children.length > 0; i++) {
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
                if (nomSite === undefined && this._stockageSite) {
                    this.fixeSiteEnCours(null);
                }

                if (this._actionsAprèsNavigation.length > 0) {
                    this._actionsAprèsNavigationCommencées = true;
                    this._actionsAprèsNavigation.forEach(action => action());
                    this._actionsAprèsNavigation = [];
                    this._actionsAprèsNavigationCommencées = false;
                }
            });
    }

    public historique(): string[] {
        const stock = this._stockageHistorique.litStock();
        return stock ? stock : [];
    }

    public dernièreUrl(): string {
        const historique = this.historique();
        return historique.length > 0 ? historique[historique.length - 1] : null;
    }

    public urlPrécédente(): string {
        const historique = this.historique();
        return historique.length > 1 ? historique[historique.length - 2] : null;
    }

    public routePasseParSite(): boolean {
        const historique = this.historique();
        return historique.length > 0 && SiteRoutes.nomSite(historique[historique.length - 1]) !== undefined;
    }

    public litSiteEnCours(): Site {
        const isite = this._stockageSite.litStock();
        return isite ? new Site(isite) : null;
    }
    public fixeSiteEnCours(site: Site) {
        this._stockageSite.fixeStock(site);
    }

    get pageDefs(): PageDef[] {
        return this._stockagePageDefs.litStock();
    }

    public siteObs(): Observable<Site> {
        return this._siteSubject.asObservable();
    }

    public keySiteObs(): Observable<KeyUidRno> {
        return this._keySiteSubject.asObservable();
    }

    public changementDePageDef(): Observable<boolean> {
        return this._pageDefSAChangé.asObservable();
    }

    public changementHistorique(): Observable<boolean> {
        return this._historiqueAChangé.asObservable();
    }

    public actionsAprèsNavigation(action: () => void) {
        if (!this._actionsAprèsNavigationCommencées) {
            this._actionsAprèsNavigation.push(action);
        }
    }
    public get actionsAprèsNavigationCommencées(): boolean {
        return this._actionsAprèsNavigationCommencées;
    }
}
