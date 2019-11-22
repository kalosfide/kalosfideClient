import { Site } from '../../modeles/site';
import { IdEtatSite } from '../../modeles/etat-site';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { NavigationService } from 'src/app/services/navigation.service';
import { Conditions } from '../condition/condition';

export class ConditionEtatSite extends Conditions<IdEtatSite> {

    constructor(navigation: NavigationService) {
        super();
        this.observe(
            [IdEtatSite.aucun, IdEtatSite.catalogue, IdEtatSite.livraison, IdEtatSite.ouvert],
            KfInitialObservable.transforme(
                KfInitialObservable.nouveau(navigation.litSiteEnCours(), navigation.siteObs()),
                (site: Site) => site ? site.etat : IdEtatSite.aucun
            )
        );
    }

    get catalogue(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.catalogue);
    }

    get pas_catalogue(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(IdEtatSite.catalogue);
    }

    get livraison(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.livraison);
    }

    get pas_livraison(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(IdEtatSite.livraison);
    }

    get ouvert(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.ouvert);
    }

    get pas_ouvert(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(IdEtatSite.ouvert);
    }
}
