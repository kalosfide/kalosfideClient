import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { CommanderService } from './commander.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { ICommanderComponent } from './i-commander-component';
import { CommanderCommandeComponent } from './commander-commande.component';
import { ModeAction } from 'src/app/commandes/condition-action';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommanderSupprimeComponent extends CommanderCommandeComponent implements OnInit, OnDestroy, ICommanderComponent {

    static _pageDef: PageDef = CommandePages.liste;
    pageDef: PageDef = CommandePages.liste;

    get titre(): string {
        return `${this.pageDef.titre}${this._commande ? ' n° ' + this._commande.no : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
    ) {
        super(route, _service);
    }

    get modeActionInitial() {
        return ModeAction.supprime;
    }
}
