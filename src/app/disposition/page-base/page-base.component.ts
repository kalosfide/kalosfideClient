import { Title } from '@angular/platform-browser';
import { Subscription, Observable, NEVER } from 'rxjs';

import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';

import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiResult200Ok } from '../../commun/api-results/api-result-200-ok';
import { ApiResult201Created } from '../../commun/api-results/api-result-201-created';
import { ApiResult204NoContent } from '../../commun/api-results/api-result-204-no-content';
import { ApiResultErreur } from '../../commun/api-results/api-result-erreur';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';

class Chargement {
    fonction: () => Observable<ApiResult>;
    fini: boolean;
}

export abstract class PageBaseComponent {

    subscriptions: Subscription[] = [];

    protected abstract nom: string;
    protected abstract titreHtml: string;
    protected abstract titre: string;
    protected abstract chargeAsync: (() => Observable<ApiResult>)[];

    protected abstract superGroupe: KfSuperGroupe;

    messageChargement: string;
    chargementFini: boolean;
    erreurChargement: KfAfficheResultat;

    constructor(
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) { }

    ngOnInit_TitreHtml() {
        this.titleService.setTitle(this.titreHtml);
    }

    ngOnInit_Charge() {
        if (this.chargeAsync) {
            const chargements = this.chargeAsync.map<Chargement>(
                chargeFnc => ({
                    fonction: chargeFnc,
                    fini: false
                })
            );
            this.attenteAsyncService.commence();
            this.chargementFini = false;
            chargements.forEach(chargement => {
                this.subscriptions.push(chargement.fonction().subscribe(
                    (result: ApiResult) => {
                        switch (result.statusCode) {
                            case ApiResult200Ok.code:
                            case ApiResult201Created.code:
                            case ApiResult204NoContent.code:
                                chargement.fini = true;
                                if (!chargements.find(c => !c.fini)) {
                                    this.finitChargement();
                                }
                                break;
                            default:
                                this.finitChargement('Fausse erreur: ApiResultSuccès non référencé');
                                console.log('log impossible');
                                break;
                        }
                    },
                    (err) => {
                        this.finitChargement((err as ApiResultErreur).message);
                        return NEVER;
                    }
                ));
            });
        } else {
            this.chargementFini = true;
        }

    }

    private finitChargement(message?: string) {
        this.chargementFini = true;
        this.attenteAsyncService.finit();
        if (message) {
            const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Echec);
            resultat.titre = 'Initialisation impossible';
            resultat.titre += message;
            resultat.titre = 'Initialisation impossible: ' + message;
            this.erreurChargement = new KfAfficheResultat('chargement');
            this.erreurChargement.finit(resultat);
        }
    }

    ngOnDestroy_Subscriptions() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
