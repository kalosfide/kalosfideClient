import { Observable } from 'rxjs';

export type TypeRafraichitStockage = 'aucun' | 'déclenche' | 'rafraichi';

export interface StockageOptions<T> {
    /**
     * fonction à appeler quand on remplace un ancien stock par un nouveau
     */
    quandStockChange?: (ancien: T, nouveau: T) => void;

    /**
     * si vrai, la date est enregistrée à chaque fixation du stock
     */
    avecDate?: boolean;

    /**
     * si 'déclenche', doitRéinitialiser est requis.
     * si 'rafraichi', doitRéinitialiser est fixé à la création
     */
    rafraichit: TypeRafraichitStockage;

    /**
     * à chaque émission, le stockage est initialisé
     */
    doitRéinitialiser?: Observable<any>;
}
