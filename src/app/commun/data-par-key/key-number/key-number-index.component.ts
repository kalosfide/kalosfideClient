import { Router, ActivatedRoute } from '@angular/router';
import { IKeyNumber } from './i-key-number';
import { KeyNumberService } from './key-number.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../../services/titreHtml.service';
import { AttenteAsyncService } from '../../../services/attenteAsync.service';
import { DataKeyIndexComponent } from '../data-key-index.component';

export abstract class KeyNumberIndexComponent<T extends IKeyNumber> extends DataKeyIndexComponent<T>  {

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: KeyNumberService<T>,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
    }

    appRouteDeKey = (ligne: IKeyNumber): string => {
        return ligne.id.toString();
    }
}
