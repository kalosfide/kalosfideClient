import { Observable, of } from 'rxjs';
import { KfResultatAffichable } from '../kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { map, catchError, startWith, delay } from 'rxjs/operators';
import { ApiResult400BadRequest } from './api-result-400-bad-request';
import { ApiResultErreur } from './api-result-erreur';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { Router } from '@angular/router';

export abstract class ApiResult {
    statusCode: number;
    routeErreur: any[];

    constructor(statusCode: number, routeErreur?: any[]) {
        this.statusCode = statusCode;
        this.routeErreur = routeErreur;
    }

    static résultatSoumission$(
        formulaire: KfSuperGroupe,
        apiResult$: Observable<ApiResult>,
        titreErreur?: string,
        titreSucces?: string,
    ): Observable<KfResultatAffichable> {
        return apiResult$
            .pipe(
                delay(0),
                map((result: ApiResult): KfResultatAffichable => {
                    if (!result) {
                        return null;
                    }
                    let resultat: KfResultatAffichable;
                    switch (result.statusCode) {
                        case 200:
                        case 201:
                        case 204:
                            resultat = new KfResultatAffichable(KfTypeResultatAffichable.Ok, titreSucces);
                            console.log('Ok', resultat);
                            return resultat;
                        case 400:
                            resultat = new KfResultatAffichable(KfTypeResultatAffichable.Echec);
                            if (formulaire) {
                                const validationErrors = (result as ApiResult400BadRequest).validationErrors;
                                const mesErreurs = formulaire.gereValeur.distribueValidationErrors(validationErrors);
                                const details = formulaire.gereValeur.messages(mesErreurs);
                                if (details.length > 0) {
                                    resultat.titre = `${titreErreur}: ${details.shift()}`;
                                    resultat.détails = details;
                                } else {
                                    resultat.titre = titreErreur;
                                }
                            } else {
                                resultat.titre = titreErreur;
                            }
                            return resultat;
                        default:
                            console.log('log impossible');
                            break;
                    }
                }))
            .pipe(catchError((err) => {
                const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Echec);
                switch (err.statusCode) {
                    case 400:
                        const validationErrors = (err as ApiResult400BadRequest).validationErrors;
                        const mesErreurs = formulaire.gereValeur.distribueValidationErrors(validationErrors);
                        const details = formulaire.gereValeur.messages(mesErreurs);
                        if (details.length > 0) {
                            resultat.titre = `${titreErreur}: ${details.shift()}`;
                            resultat.détails = details;
                        } else {
                            resultat.titre = titreErreur;
                        }
                        break;
                    default:
                        if (formulaire) {
                            formulaire.formGroup.markAsDirty();
                        }
                        resultat.titre = `${titreErreur}: ${(err as ApiResultErreur).message}`;
                }
                console.log(err, resultat);
                return of(resultat);
            }
            ));
    }

}
