import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { CommanderService } from './commander.service';
import { map, take } from 'rxjs/operators';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { CommandeRoutes } from './commander-pages';

@Injectable({
    providedIn: 'root',
})
export class EffaceStockSiContexteChangé implements CanActivate, CanActivateChild {

    constructor(
        protected commandeService: CommanderService,
        protected catalogueService: CatalogueService,
    ) {
    }

    effaceStockSiContexteChangé(): Observable<boolean> {
        return this.commandeService.apiContexte$().pipe(
            take(1),
            map(contexte => {
                const site = this.commandeService.navigation.litSiteEnCours();
                let changé: boolean;
                if (contexte.etatSite !== site.etat) {
                    site.etat = contexte.etatSite;
                    this.commandeService.navigation.fixeSiteEnCours(site);
                    this.commandeService.identification.fixeSiteIdentifiant(site);
                    changé = true;
                }
                changé = changé || this.commandeService.effaceStockSiContexteChangé(contexte, site);
                changé = changé || this.catalogueService.effaceStockSiObsolete(contexte.dateCatalogue);
                return changé;
            })
        );
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.effaceStockSiContexteChangé().pipe(map(() => true));
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}

@Injectable({
    providedIn: 'root',
})
export class RedirigeSiContexteChangé extends EffaceStockSiContexteChangé implements CanActivate, CanActivateChild {

    constructor(
        private routeur: RouteurService,
        protected commandeService: CommanderService,
        protected catalogueService: CatalogueService,
    ) {
        super(commandeService, catalogueService);
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.effaceStockSiContexteChangé().pipe(
            map(changé => {
                const site = this.commandeService.navigation.litSiteEnCours();
                if (changé) {
                    this.routeur.naviguePageDef(CommandePages.liste, CommandeRoutes, site.nomSite);
                    return false;
                }
                return true;
            })
        );
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
