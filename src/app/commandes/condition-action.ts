import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';
import { Conditions } from '../commun/condition/condition';

export enum ModeAction {
    aperçu = 'aperçu',
    aucun = 'aucun',
    doitCréer = 'doitCréer',
    edite = 'edite',
    envoi = 'envoi',
    envoyer = 'envoyer',
    supprime = 'supprime',
}

export class ConditionAction extends Conditions<ModeAction> {

    constructor(modeActionIo: KfInitialObservable<ModeAction>) {
        super();
        this.observe([
            ModeAction.aperçu,
            ModeAction.aucun,
            ModeAction.doitCréer,
            ModeAction.edite,
            ModeAction.envoi,
            ModeAction.envoyer,
            ModeAction.supprime
        ], modeActionIo);
        this.nom = 'action';
    }

    get aperçu(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.aperçu);
    }
    get pas_aperçu(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.aperçu);
    }

    get aucun(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.aucun);
    }
    get pas_aucun(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.aucun);
    }

    get doitCréer(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.doitCréer);
    }
    get pas_doitCréer(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.doitCréer);
    }

    get edite(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.edite);
    }
    get pas_edite(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.edite);
    }

    get envoi(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.envoi);
    }
    get pas_envoi(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.envoi);
    }

    get envoyer(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.envoyer);
    }
    get pas_envoyer(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.envoyer);
    }

    get supprime(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.supprime);
    }
    get pas_supprime(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.supprime);
    }

}
