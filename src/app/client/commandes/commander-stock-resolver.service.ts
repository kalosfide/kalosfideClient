import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { CommanderService } from './commander.service';
import { CommanderStock } from './commander';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { take, switchMap } from 'rxjs/operators';

@Injectable()
/**
 * retourne le CommanderStock
 */
export class CommanderStockBonResolverService extends DataResolverService implements Resolve<CommanderStock> {

    constructor(
        private _service: CommanderService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CommanderStock | Observable<CommanderStock> {
        return this._service.résoudPageBon();
    }

}

@Injectable()
/**
 * Retourne le CommanderStock déjà chargé si le contexte n'a pas changé.
 * La Garde a redirigé vers la page bon
 */
export class CommanderStockResolverService extends DataResolverService implements Resolve<CommanderStock> {

    constructor(
        private _service: CommanderService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CommanderStock | Observable<CommanderStock> {
        return this._service.résoudAutrePage();
    }

}
