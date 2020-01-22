import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { ApiCommande } from './api-commande';
import { Subscription } from 'rxjs';
import { ApiRequêteService } from '../services/api-requete.service';
import { CommandeUtile } from './commande-utile';
import { Site } from '../modeles/site/site';
import { ModeTable } from '../commun/data-par-key/condition-table';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';
import { ModeAction } from './condition-action';

export abstract class CommandeActionService extends KeyUidRnoNoService<ApiCommande> {

    private _modeActionIO: KfInitialObservable<ModeAction>;
    private _subscriptionDeModeTableAModeAction: Subscription;

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    protected abstract get transformeSiteFnc(): (site: Site) => ModeAction;

    protected get transformeModeFnc(): (modeAction: ModeAction) => ModeTable {
        return (modeAction: ModeAction) => {
            switch (modeAction) {
                case ModeAction.aperçu:
                    return ModeTable.aperçu;
                case ModeAction.aucun:
                    return ModeTable.sans;
                case ModeAction.envoi:
                    return ModeTable.bilan;
                case ModeAction.doitCréer:
                    return ModeTable.aperçu;
                case ModeAction.supprime:
                    return ModeTable.aperçu;
                default:
                    return ModeTable.edite;
            }
        };
    }

    private modeTableSouscritAModeAction() {
        this._subscriptionDeModeTableAModeAction = this._modeActionIO.observable.subscribe(modeAction => {
            this._modeTableIO.changeValeur(this.transformeModeFnc(modeAction));
        });
    }

    créeUtile() {
        const site = this.navigation.litSiteEnCours();
        this._modeActionIO = KfInitialObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        this._modeTableIO = KfInitialObservable.nouveau<ModeTable>(this.transformeModeFnc(this._modeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this._créeUtile();
        this._utile.observeModeTable(this._modeTableIO);
        this.utile.observeModeAction(this._modeActionIO);
        this.utile.créeAutresConditions();
        // IMPORTANT à faire après la création des condi
        const siteObs = this.navigation.siteObs();
        siteObs.subscribe(site1 => {
            this._modeActionIO.changeValeur(this.transformeSiteFnc(site1));
        });
    }

    initialiseModeAction(modeAction: ModeAction, modeTable?: ModeTable) {
        if (modeAction) {
            if (modeTable) {
                this._subscriptionDeModeTableAModeAction.unsubscribe();
            }
            this.changeMode(modeAction);
            if (modeTable) {
                this.modeTableSouscritAModeAction();
            }
        }
        if (modeTable) {
            this._modeTableIO.changeValeur(modeTable);
        }
    }

    get modeActionIO(): KfInitialObservable<ModeAction> {
        return this._modeActionIO;
    }

    get modeAction(): ModeAction {
        return this._modeActionIO.valeur;
    }

    changeMode(mode: ModeAction) {
        this._modeActionIO.changeValeur(mode);
    }

    get utile(): CommandeUtile {
        return this._utile as CommandeUtile;
    }

}
