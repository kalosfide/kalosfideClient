import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AttenteAsyncService {

    private attenteAsync = new Subject<boolean>();

    constructor() {
    }

    commence() {
        this.attenteAsync.next(true);
    }

    finit() {
        this.attenteAsync.next(false);
    }

    attenteAsync$(): Observable<boolean> {
        return this.attenteAsync.asObservable();
    }
}
