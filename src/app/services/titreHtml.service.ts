import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TitreHtmlService {

    private titreHtml: string;

    constructor(
    ) {
    }

    fixeTitreHtml(titreHtml: string) {
        this.titreHtml = titreHtml;
    }

    titreHtml$(): Observable<string> {
        return of(this.titreHtml);
    }
}
