import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TypeRafraichitStockage, StockageOptions } from './stockage-options';
import { Stockage } from './stockage';
import { stockageAbsent } from './stockage-absent';

interface IStockage {

    nom: string;
    initialise(): void;

}

@Injectable({
    providedIn: 'root'
})
export class StockageService {
    private _stockages: IStockage[];
    private _subjectRafraichit: Subject<boolean>;
    rafraichitObs: Observable<boolean>;
    private _subscriptions: Subscription[];


    constructor() {
        this._stockages = [];
        this._subjectRafraichit = new Subject<boolean>();
        this.rafraichitObs = this._subjectRafraichit.asObservable();
        this._subscriptions = [];
    }

    nouveau<T>(nom: string, options: StockageOptions<T>): Stockage<T> {
        if (nom === undefined || nom === null || nom === '') {
            throw new Error('Un stockage doit avoir un nom.');
        }
        if (this._stockages.find(s => s.nom === nom) !== undefined) {
            throw new Error('Il y a déjà un stockage avec ce nom:' + nom);
        }
        if (options.rafraichit === 'déclenche') {
            if (!options.doitRéinitialiser) {
                throw new Error(`Un stockage de type 'déclenche' doit avoir un 'doitRéinitialiser'.`);
            }
            this._subscriptions.push(options.doitRéinitialiser.subscribe(
                () => {
                    this._subjectRafraichit.next();
                }
            ));
            options.doitRéinitialiser = undefined;
        } else {
            options.doitRéinitialiser = options.rafraichit === 'aucun' ? undefined : this.rafraichitObs;
        }
        const stockage = new Stockage<T>(nom, options);
        this._stockages.push(stockage);
        return stockage;
    }
}
