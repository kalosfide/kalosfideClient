import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-menu',
    template: `
    <div #divElement [ngClass]="composant.classe" [ngStyle]="composant.style">
        <app-kf-sous-menu *ngFor="let sousMenu of composant.sousMenus"
            [composant]="sousMenu" (output)="traiteOuTransmet($event)"></app-kf-sous-menu>
    </div>
`,
    styleUrls: ['../kf-composants.scss']
})
export class KfMenuComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement', {static: false}) divElementRef: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.divElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

}
