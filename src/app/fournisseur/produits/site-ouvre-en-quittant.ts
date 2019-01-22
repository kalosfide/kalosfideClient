import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface DoitOuvrirEnQuittant {
    ouvreSite: () => Observable<boolean>;
}

@Injectable()
export class SiteOuvreEnQuittant implements CanDeactivate<DoitOuvrirEnQuittant> {
    canDeactivate(
        component: DoitOuvrirEnQuittant,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        return component.ouvreSite ? component.ouvreSite() : true;
    }
}
