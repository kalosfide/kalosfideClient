import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-image',
    template: `
    <img #imgElement [src]="composant.urlImage" [class]="composant.classe" />
`,
})
export class KfImageComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('imgElement') imgElementRef: ElementRef;

    constructor() { super(); }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.imgElementRef.nativeElement;
    }

}
