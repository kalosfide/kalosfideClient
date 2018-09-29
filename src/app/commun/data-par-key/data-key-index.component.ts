import { DataIndexComponent } from '../../disposition/data-index/data-index.component';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { tap, map } from 'rxjs/operators';
import { ApiResult200Ok } from '../api-results/api-result-200-ok';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { DataApiRoutes } from './data-api-routes';
import { DataKeyService } from './data-key.service';
import { Router, ActivatedRoute } from '@angular/router';

export abstract class DataKeyIndexComponent<T> extends DataIndexComponent<T>  {

    abstract appRouteDeKey: (key: T) => string;

    filtrePropriétaire: boolean;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);
        this.chargeAsync = [this.chargeAsync_Liste];
    }

    chargeAsync_Liste = () => {
        const liste = this.filtrePropriétaire ? this.service.listeDuPropriétaire() : this.service.liste();
        return liste
            .pipe(map(
                apiResult => {
                    if (apiResult.statusCode === ApiResult200Ok.code) {
                        const lecture = (apiResult as ApiResult200Ok<T[]>).lecture;
                        if (lecture) {
                            this.vueTable.fixeLignes(lecture);
                        }
                    }
                    return apiResult;
                }
            ));
    }

    créeLien(ligne: T, action: string, texte: string): KfLien {
        return new KfLien(action + this.appRouteDeKey(ligne), action + '/' + this.appRouteDeKey(ligne), texte);
    }

    créeLienEdite(ligne: T): KfLien {
        return this.créeLien(ligne, DataApiRoutes.App.edite, DataApiRoutes.texteLien(DataApiRoutes.App.edite));
    }

    créeLienSupprime(ligne: T): KfLien {
        return this.créeLien(ligne, DataApiRoutes.App.supprime, DataApiRoutes.texteLien(DataApiRoutes.App.supprime));
    }
}
