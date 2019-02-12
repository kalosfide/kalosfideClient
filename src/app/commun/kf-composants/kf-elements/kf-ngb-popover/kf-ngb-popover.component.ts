import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-ngb-dropdown',
    templateUrl: './kf-ngb-dropdown.component.html',
})
export class KfNgbPopoverComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') htmlElementRef: ElementRef;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.htmlElementRef.nativeElement;
        this.initialiseHtml();
    }

}
