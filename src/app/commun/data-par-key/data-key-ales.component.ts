import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { DataKeyService } from './data-key.service';
import { ApiResult } from '../api-results/api-result';
import { ApiResult200Ok } from '../api-results/api-result-200-ok';
import { DataApiRoutes } from './data-api-routes';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataKey } from './data-key';
import { DataChamp } from './data-champ';
import { DataKeyEditeur } from './data-key-editeur';

export abstract class DataKeyALESComponent<T> extends FormulaireComponent {

    abstract action: string;
    dataEditeur: DataKeyEditeur;
    abstract créeDataEditeur();

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettreAsync(DataApiRoutes.texteBouton(this.action))];

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);
        this.chargeAsync = [this.chargeAsync_ALES];
    }

    créeEdition = (): KfGroupe => {
        this.créeDataEditeur();
        this.dataEditeur.créeEdition(this.action);
        return this.dataEditeur.edition;
    }

    private chargeAsync_A = (): Observable<ApiResult> => {
        return this.service.créeKey()
            .pipe(
                map(
                    apiResult => {
                        if (apiResult.statusCode === 200) {
                            const key = (apiResult as ApiResult200Ok<DataKey>).lecture;
                            this.dataEditeur.fixeChampsKeys(key);
                        }
                        return apiResult;
                    }
                )
            );
    }

    private chargeAsync_LES = (): Observable<ApiResult> => {
        return this.route.data
            .pipe(
                switchMap(
                    routeData => {
                        const key = this.service.keyRouteData(routeData);
                        return this.service.lit(key);
                    }
                ),
                map(
                    apiResult => {
                        if (apiResult.statusCode === 200) {
                            this.valeur = (apiResult as ApiResult200Ok<T>).lecture;
                        }
                        return apiResult;
                    }
                )
            );
    }

    protected chargeAsync_ALES = (): Observable<ApiResult> => {
        switch (this.action) {
            case DataApiRoutes.Api.ajoute:
                return this.chargeAsync_A();
            case DataApiRoutes.Api.edite:
            case DataApiRoutes.Api.supprime:
                return this.chargeAsync_LES();
            default:
                break;
        }
    }

    soumission = (): Observable<ApiResult> => {
        switch (this.action) {
            case DataApiRoutes.Api.ajoute:
                return this.service.ajoute(this.valeur);
            case DataApiRoutes.Api.edite:
                return this.service.edite(this.valeur);
            case DataApiRoutes.Api.supprime:
                return this.service.supprime(this.valeur);
            default:
                break;
        }
    }

    actionSiOk = (): void => {
        this.router.navigate(['..']);
    }

    get valeur(): any {
        return this.dataEditeur.valeur;
    }

    set valeur(valeur: any) {
        this.dataEditeur.valeur = valeur;
    }
}
