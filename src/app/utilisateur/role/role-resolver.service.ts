import { Router, Resolve } from '@angular/router';

import { RouteurService } from '../../services/routeur.service';

import { KeyUidNoResolverService } from '../../commun/data-par-key/key-uid-no/key-uid-no-resolver.service';
import { KeyUidNo } from '../../commun/data-par-key/key-uid-no/key-uid-no';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleResolverService extends KeyUidNoResolverService implements Resolve<KeyUidNo> {

    constructor(
        private _routeurService: RouteurService,
        private _router: Router) {
        super();
    }

    get routeurService(): RouteurService { return this._routeurService; }
    get router(): Router { return this._router; }
}
