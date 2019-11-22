import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientRoutes, ClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site';
import { Client } from 'src/app/modeles/clientele/client';
import { ClientService } from 'src/app/modeles/clientele/client.service';
import { ClientEditeur } from './client-editeur';
import { KeyUidRnoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-ales.component';

export abstract class ClientALESComponent extends KeyUidRnoALESComponent<Client> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ClientPages;
    dataRoutes = ClientRoutes;

    site: Site;
    client: Client;
    constructor(
        protected route: ActivatedRoute,
        protected _service: ClientService,
    ) {
        super(route, _service);
    }

    get service(): ClientService {
        return this._service;
    }

    créeDataEditeur()  {
        this.dataEditeur = new ClientEditeur();
    }

    fixeValeur(client: Client) {
        this.dataEditeur.fixeValeur(client);
        this.client = client;
    }

}
