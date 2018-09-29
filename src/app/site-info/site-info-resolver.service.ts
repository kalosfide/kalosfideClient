import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { KeyNumberResolverService } from '../commun/data-par-key/key-number/key-number-resolver.service';
import { KeyNumber } from '../commun/data-par-key/key-number/key-number';

@Injectable()
export class SiteInfoResolverService extends KeyNumberResolverService implements Resolve<KeyNumber> {

    constructor(
        private _routeurService: RouteurService,
        private _router: Router) {
        super();
    }

    get routeurService(): RouteurService { return this._routeurService; }
    get router(): Router { return this._router; }

}
