import { Router, ActivatedRoute } from '@angular/router';

import { IKeyUidNo } from './i-key-uid-no';
import { KeyUidNoService } from './key-uid-no.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../../services/titreHtml.service';
import { AttenteAsyncService } from '../../../services/attenteAsync.service';
import { DataKeyIndexComponent } from '../data-key-index.component';

export abstract class KeyUidNoIndexComponent<T extends IKeyUidNo> extends DataKeyIndexComponent<T>  {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: KeyUidNoService<T>,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
    }

    appRouteDeKey = (ligne: IKeyUidNo): string => {
        return ligne.utilisateurId + '/' + ligne.no.toString();
    }
}
