import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IdentificationService } from './identification.service';
import { Observable } from 'rxjs';
import { CompteApiRoutes } from '../compte/compte-api-routes';

@Injectable()
export class VisiteurExcluGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private identification: IdentificationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (!this.identification.estIdentifié()) {
            this.identification.retourUrl = _state.url;
            this.router.navigate([CompteApiRoutes.Route(CompteApiRoutes.App.connection)]);
            return false;
        }
        return true;
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> |  boolean {
        return this.canActivate(route, state);
      }


}
