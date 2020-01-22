import { Observable, Subject, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class KfInitialObservable<T> {
    private _valeur: T;
    private _subject: Subject<T>;
    private _observable: Observable<T>;

    nom: string;

    private constructor(valeurInitiale: T) {
        this._valeur = valeurInitiale;
    }

    /**
     * crée un KfInitialObservable dont l'observable émettra la valeur chaque fois qu'elle change
     * @param valeur valeur initiale
     * @param observable si absent, un Subject est créé pour l'observable
     */
    static nouveau<V>(valeur: V, observable?: Observable<V>): KfInitialObservable<V> {
        const io = new KfInitialObservable<V>(valeur);
        if (observable) {
            io._observable = observable;
        } else {
            io._subject = new Subject<V>();
            io._observable = io._subject.asObservable();
        }
        return io;
    }

    /**
     * Crée un KfInitialObservable<V2> dont la valeur et l'observable sont les transformés de ceux d'un KfInitialObservable<V1>.
     * L'observable transformé n'emet pas si la valeur transformée est nulle.
     * @param initialObservable KfInitialObservable<V1> à transformer
     * @param transforme transformation de V1 en V2
     */
    static transforme<V1, V2>(initialObservable: KfInitialObservable<V1>, transforme: (v: V1) => V2): KfInitialObservable<V2> {
        const io = new KfInitialObservable<V2>(transforme(initialObservable.valeur));
        io._observable = initialObservable.observable.pipe(
            filter((v1: V1) => {
                const v2 = transforme(v1);
                if (v2 === null || v2 === undefined) {
                    return false;
                } else {
                    io._valeur = v2;
                    return true;
                }
            }),
            map((v1: V1) => {
                return io._valeur;
            }));
        return io;
    }

    static et(io1: KfInitialObservable<boolean>, io2: KfInitialObservable<boolean>): KfInitialObservable<boolean> {
        const io = new KfInitialObservable<boolean>(io1._valeur && io2._valeur);
        io._observable = merge(io1._observable, io2._observable).pipe(
            map(v => {
                io._valeur = io1._valeur && io2._valeur;
                return io._valeur;
            })
        );
        return io;
    }

    static ou(io1: KfInitialObservable<boolean>, io2: KfInitialObservable<boolean>): KfInitialObservable<boolean> {
        const io = new KfInitialObservable<boolean>(io1._valeur || io2._valeur);
        io._observable = merge(io1._observable, io2._observable).pipe(
            map(v => {
                io._valeur = io1._valeur || io2._valeur;
                return io._valeur;
            })
        );
        return io;
    }

    static non(io: KfInitialObservable<boolean>): KfInitialObservable<boolean> {
        const io1 = new KfInitialObservable<boolean>(!io._valeur);
        io1._observable = io._observable.pipe(
            map(v => {
                io._valeur = !v;
                return !v;
            })
        );
        return io1;
    }

    get valeur(): T {
        return this._valeur;
    }

    get observable(): Observable<T> {
        return this._observable;
    }

    /**
     * change la valeur stockée et si le KfInitialObservable n'est pas un tranformé, emet la valeur
     * @param valeur nouvelle valeur
     */
    changeValeur(valeur: T) {
        this._valeur = valeur;
        if (this.nom) {
            console.log(`IO ${this.nom}: ${valeur}`);
        }
        if (this._subject) {
            this._subject.next(valeur);
        }
    }

    /**
     * fixe la valeur sans toucher à l'observable
     * @param valeur nouvelle valeur
     */
    changeValeurSansEmettre(valeur: T) {
        this._valeur = valeur;
    }

    /**
     * crée un KfInitialObservable<V1> dont l'observable émettra la valeur chaque fois qu'elle change
     * et souscrit à un Observable<V2> pour changer sa valeur transformée en V1
     * @param valeur valeur initiale
     * @param observable KfInitialObservable<V2> auquel souscrire
     * @param transforme transformation de V2 en V1
     */
    souscrit<V2>(io2: KfInitialObservable<V2>, transforme: (v: V2) => T) {
        io2.observable.subscribe((v: V2) => {
            this.changeValeur(transforme(v));
        });
    }
}

