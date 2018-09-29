import {
    Component, OnInit, Input,
    ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfMenu } from './kf-menu';
import { KfSousMenu } from './kf-sous-menu';

@Component({
    selector: 'app-kf-sous-menu',
    templateUrl: './kf-sous-menu.component.html',
})
export class KfSousMenuComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('divElement') divElementRef: ElementRef;

    constructor() {
        super();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.divElementRef.nativeElement;
        this.initialiseHtml();
    }

    get sousMenu(): KfSousMenu {
        return this.composant as KfSousMenu;
    }

}
