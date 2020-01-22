import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientALESComponent } from './client-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ClientPages } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ClientAjouteComponent extends ClientALESComponent implements OnInit {

    static _pageDef: PageDef = ClientPages.ajoute;
    pageDef: PageDef = ClientPages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ClientService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionAjoute();
        this.action.actionSiOk = () => this._service.quandAjoute(this.client);
    }

}
