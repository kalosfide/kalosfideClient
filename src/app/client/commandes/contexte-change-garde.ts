import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommanderService } from './commander.service';

@Injectable({
    providedIn: 'root',
})
export class RedirigeSiContexteChangé implements CanActivate, CanActivateChild {

    constructor(
        private commandeService: CommanderService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.commandeService.gardeAutrePage();
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
