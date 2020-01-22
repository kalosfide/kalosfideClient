import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';

@Component({
    selector: 'app-kf-ul',
    templateUrl: './kf-ul.component.html',
    styleUrls: ['../kf-composants.scss']
})

export class KfUlComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }
}
