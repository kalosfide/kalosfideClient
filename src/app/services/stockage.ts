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
        return window.sessionStorage[this.nom] === undefined ||
            window.sessionStorage[this.nom] === null ||
            window.sessionStorage[this.nom] === 'null' ||
            window.sessionStorage[this.nom] === 'undefined' ||
            window.sessionStorage[this.nom] === '';
    }

    public litStock(): T {
        return this.estNull ? null : JSON.parse(window.sessionStorage[this.nom]) as T;
    }

    public fixeStock(stock: T): void {
        const ancien = !this.estNull ? this.litStock() : null;
        window.sessionStorage[this.nom] = stock ? JSON.stringify(stock) : undefined;
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
