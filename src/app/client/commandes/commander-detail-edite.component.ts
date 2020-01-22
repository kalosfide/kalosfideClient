import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { CommanderService } from './commander.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { CommanderDetailComponent } from './commander-detail.component';
import { CommanderPages } from './commander-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderDetailEditeComponent extends CommanderDetailComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    static _pageDef: PageDef = CommanderPages.edite;
    pageDef: PageDef = CommanderPages.edite;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
    }
}
