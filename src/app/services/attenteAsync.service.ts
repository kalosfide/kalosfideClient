import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AttenteAsyncService {

    private attenteAsync = new Subject<boolean>();

    // actions dont on attend la fin
    private actions: number;

    constructor() {
        this.actions = 0;
    }

    commence() {
        this.actions++;
        if (this.actions === 1) {
            this.attenteAsync.next(true);
        }
    }

    finit() {
        if (this.actions > 0) {
            this.actions--;
        }
        if (this.actions === 0) {
            this.attenteAsync.next(false);
        }
    }

    attenteAsync$(): Observable<boolean> {
        return this.attenteAsync.asObservable();
    }
}
