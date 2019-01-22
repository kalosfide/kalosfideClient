import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-li',
    templateUrl: './kf-li.component.html',
    styleUrls: []
})

export class KfLiComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') domElementRef: ElementRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.initialiseHtml();
    }
}
