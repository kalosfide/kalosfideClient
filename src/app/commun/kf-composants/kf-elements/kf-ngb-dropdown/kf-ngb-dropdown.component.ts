import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-ngb-dropdown',
    templateUrl: './kf-ngb-dropdown.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfNgbDropdownComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElementRef: ElementRef;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.htmlElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    estGroupe(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.ngbDropdownGroup;
    }

}
