import { StockageOptions } from './stockage-options';
import { stockageAbsent } from './stockage-absent';

export interface IStockage<T> {

    estNull(): boolean;

    litStock(): T;

    litDate(): Date;

    fixeStock(stock: T): void;

    initialise(): void;

}

export class Stockage<T> implements IStockage<T> {
    private _nom: string;
    private _avecDate: boolean;
    private _quandStockChange: (ancien: T, nouveau: T) => void;

    constructor(nom: string, options?: StockageOptions<T>) {
        this._nom = nom;
        if (options) {
            this._avecDate = options.avecDate;
            this._quandStockChange = options.quandStockChange;
            if (options.doitRéinitialiser) {
                options.doitRéinitialiser.subscribe(() => this.initialise());
            }
        }
    }

    get nom(): string {
        return this._nom + 'date';
    }

    get nomDate(): string {
        return this._nom + 'date';
    }

    public estNull(): boolean {
        return stockageAbsent(this._nom);
    }

    public litDate(): Date {
        return this.estNull() || !this._avecDate ? null : new Date(window.sessionStorage[this.nomDate]);
    }

    public litStock(): T {
        return this.estNull() ? null : JSON.parse(window.sessionStorage[this._nom]) as T;
    }

    public fixeStock(stock: T): void {
        const ancien = this.litStock();
        if ((ancien && (!stock || JSON.stringify(ancien) !== JSON.stringify(stock))) || (!ancien && !!stock)) {
            window.sessionStorage[this._nom] = stock ? JSON.stringify(stock) : undefined;
            //            console.log(this.nom, stock);
            if (this._avecDate) {
                window.sessionStorage[this.nomDate] = Date.now();
            }
            if (ancien && this._quandStockChange) {
                this._quandStockChange(ancien, stock);
            }
        }
    }

    public initialise(): void {
        this.fixeStock(undefined);
    }

}

// système de stockages qui réinitialise quand l'identifiant change

export function NouveauStockage<T>(nom: string, options?: StockageOptions<T>): IStockage<T> {
    if (nom === undefined || nom === null) {
        throw new Error('Un stockage doit avoir un nom.');
    }
    if (!stockageAbsent(nom)) {
//        throw new Error('Il y a déjà un stockage avec ce nom:' + nom);
    }
    return new Stockage<T>(nom, options);
}
