import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';

@Injectable({
    providedIn: 'root'
})
export class AttenteService {
    private _enCoursIO: KfInitialObservable<boolean>;

    private _attentes: number[];
    private _debugs: string[];
    private _nb: number;

    // identifiant du window.Timeout utilisé
    private IdTimeOut: number;

    // durée de vie du TimeOut en ms
    private délai: number;

    constructor() {
        this._enCoursIO = KfInitialObservable.nouveau(false);
        this.délai = 2;
        this.initialise();
    }

    enCours(): Observable<boolean> {
        return this._enCoursIO.observable;
    }

    private initialise() {
        this._attentes = [];
        this._nb = 0;
        this._debugs = [];
    }

    private get debugs(): string[] {
        const d: string[] = [];
        for (let i = 0; i < this._attentes.length; i++) {
            d.push('' + this._attentes[i] + ' ' + this._debugs[i]);
        }
        return d;
    }

    // le timeOut sert à ce que l'affichage ne commence pas si l'action est de courte durée
    private créeTimeOut() {
        if (this.IdTimeOut) {
            // il y a déjà un timeOut
            throw new Error('créeTimeOut');
        }

        // specify window.setTimeout to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
        this.IdTimeOut = window.setTimeout(() => this.quandDélaiTerminé(), this.délai);
    }

    private détruitTimeOut() {
        clearTimeout(this.IdTimeOut);
        this.IdTimeOut = undefined;
    }

    private quandDélaiTerminé() {
//        console.log('délaiTerminé', this._attentes);
        this.détruitTimeOut();
        this._enCoursIO.changeValeur(true);
    }

    commence(debug?: string): number {
        const attente = ++this._nb;
        this._attentes.push(attente);
        debug = debug ? debug : 'sans nom';
        this._debugs.push(debug);
        console.log('commence', this.debugs);
        if (this._nb === 1) {
            this.créeTimeOut();
        }
        return attente;
    }

    finit(attente: number) {
        if (this._attentes.length === 1 && this._attentes[0] === attente) {
            if (this.IdTimeOut) {
                this.détruitTimeOut();
            }
            const debug = this._debugs[0];
            this.initialise();
            console.log('finit et emet', this.debugs);
            this._enCoursIO.changeValeur(false);
        } else {
            const index = this._attentes.findIndex(id => id === attente);
            if (index === -1) {
                throw new Error('AttenteService: id d\'attente à terminer invalide');
            }
            this._attentes.splice(index, 1);
            const debug = this._debugs.splice(index, 1)[0];
            console.log('finit', this.debugs);
        }
    }

}
