import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfVueJson } from './kf-vue-json';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-vue-json',
    template: `
    <div [class]="composant.classe">
        <pre #preElement>{{ composant.texte }}</pre>
    </div>
  `,
})
export class KfVueJsonComponent extends KfComposantComponent implements AfterViewInit {
    @ViewChild('preElement') preElement: ElementRef;

    constructor() {
        super();
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.preElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            preElement: this.preElement.nativeElement,
        };
        this.initialiseHtml();
    }

}
