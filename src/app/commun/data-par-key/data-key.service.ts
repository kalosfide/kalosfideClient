
import { Observable } from 'rxjs';

import { ApiResult } from '../api-results/api-result';
import { DataService } from '../../services/data.service';
import { IDataKey } from './data-key';
import { ApiAction } from '../api-route';
import { tap } from 'rxjs/operators';
import { ApiResult201Created } from '../api-results/api-result-201-created';
import { DataUtile } from 'src/app/commun/data-par-key/data-utile';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { ModeTable } from './condition-table';
import { DataKeyUtile } from './data-key-utile';
import { IDataKeyService } from './i-data-key-service';

export abstract class DataKeyService<T extends IDataKey> extends DataService implements IDataKeyService {

    protected _utile: DataUtile;

    get dataService(): DataService { return this; }

    protected _modeTableIO: KfInitialObservable<ModeTable>;

    abstract urlSegmentDeKey(key: T): string;
    abstract get keyDeAjoute(): IDataKey;
    abstract fixeKeyDeAjoute(envoyé: T, reçu: T): void;

    protected _créeUtile() {
        this._utile = new DataUtile(this);
    }

    créeUtile() {
        this._modeTableIO = KfInitialObservable.nouveau<ModeTable>(ModeTable.sans);
        this._créeUtile();
        this._utile.observeModeTable(this._modeTableIO);
    }

    initialiseModeTable(modeTable: ModeTable) {
        this.changeModeTable(modeTable);
    }

    get utile(): DataKeyUtile<T> {
        return this._utile as DataKeyUtile<T>;
    }

    changeModeTable(mode: ModeTable) {
        this._modeTableIO.changeValeur(mode);
    }

    get modeTable(): ModeTable {
        return this._modeTableIO.valeur;
    }

    get modeTableIO(): KfInitialObservable<ModeTable> {
        return this._modeTableIO;
    }

    protected _créeConditionsTable() {
        this._utile.observeModeTable(this._modeTableIO);
    }

    protected créeParams(key: any): { [param: string]: string } {
        const params: { [param: string]: string } = {};
        if (key.uid) { params['uid'] = key.uid; }
        if (key.rno) { params['rno'] = key.rno; }
        if (key.no) { params['no'] = key.no; }
        if (key.date) { params['date'] = key.date; }
        if (key.uid2) { params['uid2'] = key.uid2; }
        if (key.rno2) { params['rno2'] = key.rno2; }
        if (key.no2) { params['no2'] = key.no2; }
        return params;
    }

    /**
     * demande à l'Api d'ajouter un objet à la base de données
     * @param objet contient la clé (incomplète si numAuto) et tous les autres champs
     */
    ajoute(objet: T): Observable<ApiResult> {
        return this.post<T>(this.controllerUrl, ApiAction.data.ajoute, objet).pipe(
            tap(apiResult => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    const donnée = (apiResult as ApiResult201Created).entity as T;
                    this.fixeKeyDeAjoute(objet, donnée);
                }
        })
        );
    }

    lit(key: IDataKey): Observable<ApiResult> {
        console.log(key);
        return this.get<T>(this.controllerUrl, ApiAction.data.lit, this.créeParams(key));
    }

    litGroupe<TGroupe>(key: IDataKey, apiAction?: string): Observable<ApiResult> {
        return this.get<TGroupe>(this.controllerUrl, apiAction ? apiAction : ApiAction.data.liste, this.créeParams(key));
    }

    liste(key?: IDataKey): Observable<ApiResult> {
        return key
            ? this.getAll<T>(this.controllerUrl, ApiAction.data.liste, this.créeParams(key))
            : this.getAll<T>(this.controllerUrl, ApiAction.data.liste);
    }

    /**
     * demande à l'Api de modifier un objet de la base de données
     * @param objet contient la clé et les champs à modifier
     */
    edite(objet: T): Observable<ApiResult> {
        return this.put<T>(this.controllerUrl, ApiAction.data.edite, objet);
    }

    /**
     * demande à l'Api de supprimer un objet de la base de données
     * @param key clé de l'objet à supprimer
     */
    supprime(key: IDataKey): Observable<ApiResult> {
        return this.delete(this.controllerUrl, ApiAction.data.supprime, this.créeParams(key));
    }

}
