import { DataService } from '../../services/data.service';
import { Site } from '../../modeles/site';
import { RouteurService } from '../../services/routeur.service';
import { ConditionEtatSite } from './condition-etat-site';
import { ConditionTable, ModeTable } from './condition-table';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { IDataKeyService } from './data-key.service';
import { DataUtileUrl } from './data-utile-url';
import { DataUtileLien } from './data-utile-lien';
import { DataUtileColonne } from './data-utile-colonne';
import { DataUtileBouton } from './data-utile-bouton';
import { DataUtileOutils } from './data-utile-outils';

export class DataUtile {
    protected _service: IDataKeyService;
    protected _url: DataUtileUrl;
    protected _lien: DataUtileLien;
    protected _bouton: DataUtileBouton;
    protected _outils: DataUtileOutils;
    protected _colonne: DataUtileColonne;
    private _conditionSite: ConditionEtatSite;
    private _conditionTable: ConditionTable;

    constructor(service: IDataKeyService) {
        this._service = service;
        this._conditionSite = new ConditionEtatSite(service.navigation);
    }

    get url(): DataUtileUrl {
        return this._url;
    }

    get lien(): DataUtileLien {
        return this._lien;
    }

    get colonne(): DataUtileColonne {
        return this._colonne;
    }

    get service(): DataService {
        return this._service.dataService;
    }

    get site(): Site {
        return this.service.navigation.litSiteEnCours();
    }

    get routeur(): RouteurService {
        return this.service.routeur;
    }

    get conditionSite(): ConditionEtatSite {
        return this._conditionSite;
    }

    observeModeTable(modeTableIo: KfInitialObservable<ModeTable>) {
        this._conditionTable = new ConditionTable(modeTableIo);
    }

    get conditionTable(): ConditionTable {
        return this._conditionTable;
    }
}
