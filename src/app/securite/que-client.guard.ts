import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IdentificationService } from './identification.service';
import { Observable } from 'rxjs';
import { UtilisateurApiRoutes } from '../utilisateur/utilisateur-api-routes';

@Injectable()
export class QueClientGuard implements CanActivate {

    constructor(
        private router: Router,
        private identification: IdentificationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        const revendications = this.identification.litIdentifiant().revendications;
        if (revendications.rono === 0) {
            this.router.navigate([UtilisateurApiRoutes.Route(UtilisateurApiRoutes.App.role)]);
            return false;
        }
        return true;
    }
}
