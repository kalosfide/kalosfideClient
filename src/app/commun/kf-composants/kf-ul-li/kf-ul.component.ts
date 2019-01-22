import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-ul',
    templateUrl: './kf-ul.component.html',
    styleUrls: []
})

export class KfUlComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') domElementRef: ElementRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.initialiseHtml();
    }
}
