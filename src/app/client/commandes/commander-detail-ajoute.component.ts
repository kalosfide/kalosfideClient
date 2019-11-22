import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { CommanderService } from './commander.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { CommanderDetailComponent } from './commander-detail.component';
import { ICommanderComponent } from './i-commander-component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderDetailAjouteComponent extends CommanderDetailComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter, ICommanderComponent {

    static _pageDef: PageDef = CommandePages.ajoute;
    pageDef: PageDef = CommandePages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
        this.ajout = true;
    }
}
