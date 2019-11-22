import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommanderService } from './commander.service';
import { CommanderStock } from './commander';
import { DataResolverService } from 'src/app/services/data-resolver.service';

@Injectable()
/**
 * retourne le CommanderStock
 */
export class CommanderStockResolverService extends DataResolverService implements Resolve<CommanderStock> {

    constructor(
        private _service: CommanderService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommanderStock> {
        return this._service.stock$();
    }

}
