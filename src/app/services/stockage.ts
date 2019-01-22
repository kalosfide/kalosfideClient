export interface QuandStockChange<T> {
    distincts: (stock1: T, stock2: T) => boolean;
    action: () => void;
}

export class Stockage<T> {
    nom: string;
    quandStockChange: QuandStockChange<T>;

    constructor(nom: string, quandStockChange?: QuandStockChange<T>) {
        this.nom = nom;
        this.quandStockChange = quandStockChange;
        this.initialise();
    }

    public get estNull(): boolean {
        return window.localStorage[this.nom] === undefined ||
            window.localStorage[this.nom] === null ||
            window.localStorage[this.nom] === 'null' ||
            window.localStorage[this.nom] === 'undefined' ||
            window.localStorage[this.nom] === '';
    }

    public litStock(): T {
        return this.estNull ? null : JSON.parse(window.localStorage[this.nom]) as T;
    }

    public fixeStock(stock: T): void {
        const ancien = !this.estNull ? this.litStock() : null;
        window.localStorage[this.nom] = stock ? JSON.stringify(stock) : undefined;
        if (this.quandStockChange) {
            if ((ancien && (!stock || this.quandStockChange.distincts(stock, ancien))) || (!ancien && !!stock)) {
                this.quandStockChange.action();
            }
        }
    }

    public initialise(): void {
        this.fixeStock(undefined);
    }

}
