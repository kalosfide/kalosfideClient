import { Observable, of } from 'rxjs';
import { KfResultatAffichable, KfTypeResultatAffichable } from '../kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { map, catchError } from 'rxjs/operators';
import { ApiResult400BadRequest } from './api-result-400-bad-request';
import { ApiResultErreur } from './api-result-erreur';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';

export abstract class ApiResult {
    statusCode: number;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

    static transformeApiResult$(
        formulaire: KfSuperGroupe,
        apiResult$: Observable<ApiResult>,
        titreErreur?: string,
        titreSucces?: string
    ): Observable<KfResultatAffichable> {
        return apiResult$
            .pipe(map(
                (result: ApiResult) => {
                    switch (result.statusCode) {
                        case 200:
                        case 201:
                        case 204:
                            const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Ok, titreSucces);
                            console.log('Ok', resultat);
                            return resultat;
                        default:
                            console.log('log impossible');
                            break;
                    }
                }))
            .pipe(catchError(
                (err) => {
                    const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Echec);
                    switch (err.statusCode) {
                        case 400:
                            const validationErrors = (err as ApiResult400BadRequest).validationErrors;
                            const mesErreurs = formulaire.gereValeur.distribueValidationErrors(validationErrors);
                            const details = formulaire.gereValeur.messages(mesErreurs);
                        if (details.length > 0) {
                                resultat.titre = titreErreur + ': ' + details.shift();
                                resultat.détails = details;
                            } else {
                                resultat.titre = titreErreur;
                            }
                            break;
                        default:
                           resultat.titre = titreErreur + ': ' + (err as ApiResultErreur).message;
                    }
                    console.log(err, resultat);
                    return of(resultat);
                }
            ));
    }
}
