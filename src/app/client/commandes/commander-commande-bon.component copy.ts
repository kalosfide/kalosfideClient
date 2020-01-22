import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { CommanderService } from './commander.service';
import { ICommanderComponent } from './i-commander-component';
import { CommanderCommandeComponent } from './commander-commande.component';
import { CommanderPages } from './commander-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderCommandeBonComponent extends CommanderCommandeComponent implements OnInit, OnDestroy, ICommanderComponent {

    static _pageDef: PageDef = CommanderPages.liste;
    pageDef: PageDef = CommanderPages.liste;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
    ) {
        super(route, _service);
    }
}
