import { Component } from '@angular/core';

@Component({
    templateUrl: './page-message.component.html',
    styles: []
})
export abstract class PageMessageComponent {

    abstract titre: string;
    abstract message: string;
    abstract urlDeSortie: string;

    constructor(
    ) {
    }

}
