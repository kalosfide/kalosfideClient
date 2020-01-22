import { ClientService } from './client.service';
import { Client } from './client';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { ClientRoutes, ClientPages } from 'src/app/fournisseur/clients/client-pages';
import { ClientUtileUrl } from './client-utile-url';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { ClientUtileLien } from './client-utile-lien';
import { ClientUtileColonne } from './client-utile-colonne';
import { ClientUtileOutils } from './client-utile-outils';
import { ClientUtileBouton } from './client-utile-bouton';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';
import { KeyUidRnoUtile } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-utile';

export class ClientUtile extends KeyUidRnoUtile<Client> {
    constructor(service: ClientService) {
        super(service);
        this.dataRoutes = ClientRoutes;
        this.dataPages = ClientPages;
        this._url = new ClientUtileUrl(this);
        this._lien = new ClientUtileLien(this);
        this._bouton = new ClientUtileBouton(this);
        this._outils = new ClientUtileOutils(this);
        this._colonne = new ClientUtileColonne(this);
        this._urlKey = new DataKeyUtileUrl(this);
        this._lienKey = new DataKeyUtileLien(this);
        this._colonneKey = new DataKeyUtileColonne(this);
        this._outilsKey = new DataKeyUtileOutils(this);
    }

    get url(): ClientUtileUrl {
        return this._url as ClientUtileUrl;
    }

    get lien(): ClientUtileLien {
        return this._lien as ClientUtileLien;
    }

    get bouton(): ClientUtileBouton {
        return this._bouton as ClientUtileBouton;
    }

    get outils(): ClientUtileOutils {
        return this._outils as ClientUtileOutils;
    }

    get colonne(): ClientUtileColonne {
        return this._colonne as ClientUtileColonne;
    }

    get service(): ClientService {
        return this._service as ClientService;
    }
}
