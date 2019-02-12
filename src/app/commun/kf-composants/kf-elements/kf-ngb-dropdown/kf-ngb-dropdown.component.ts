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
export class KfNgbDropdownComponent extends KfComposantComponent implements OnInit, AfterViewInit {
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

    estGroupe(composant: KfComposant): boolean {
        return composant.typeDeComposant === KfTypeDeComposant.ngbDropdownGroup;
    }

}

@Component({
    selector: 'app-kf-ngb-dropdown-group',
    templateUrl: './kf-ngb-dropdown-group.component.html',
})
export class KfNgbDropdownGroupComponent extends KfComposantComponent {

}
