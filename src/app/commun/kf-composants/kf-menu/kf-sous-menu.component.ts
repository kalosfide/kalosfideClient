import {
    Component, OnInit, Input,
    ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfSousMenu } from './kf-sous-menu';

@Component({
    selector: 'app-kf-sous-menu',
    templateUrl: './kf-sous-menu.component.html',
    styleUrls: ['../kf-composants.scss']
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
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    get sousMenu(): KfSousMenu {
        return this.composant as KfSousMenu;
    }

}
