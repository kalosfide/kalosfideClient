import { Injectable } from '@angular/core';
import { DocumentService } from 'src/app/documents/document.service';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { ClientService } from 'src/app/modeles/client/client.service';

@Injectable()
export class FDocumentService extends DocumentService {

    constructor(
        protected _apiRequete: ApiRequêteService,
        protected _clientService: ClientService,
    ) {
        super(_apiRequete, _clientService);
    }

}
