import { Component, HostBinding, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { KfDialogueService } from './kf-dialogue.service';

@Component({
    selector: 'app-kf-dialogue',
    templateUrl: './kf-dialogue.component.html',
    styleUrls: [
        './kf-dialogue.component.css'
    ],
})
export class KfDialogueComponent implements OnInit, AfterViewInit {
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.position') position = 'absolute';

    @ViewChild('dialogElement', {static: false}) dialogElementRef: ElementRef;
    @ViewChild('dialogueBarreDeTitre', {static: false}) divBarreDeTitreRef: ElementRef;
    @ViewChild('dialogueTitre', {static: false}) pTitreRef: ElementRef;
    @ViewChild('dialogueFermer', {static: false}) spanFermerRef: ElementRef;
    @ViewChild('dialogueMessage', {static: false}) divMessageRef: ElementRef;
    @ViewChild('dialogueOk', {static: false}) buttonOkRef: ElementRef;
    @ViewChild('dialogueAnnuler', {static: false}) buttonAnnulerRef: ElementRef;

    dansDialogElement: boolean;

    constructor(
        private service: KfDialogueService
    ) { }

    ngOnInit() {
        this.dansDialogElement = this.service.dansDialogElement;
    }

    ngAfterViewInit() {
        this.service.fixeHtmlElements(
            this.dialogElementRef.nativeElement,
            this.divBarreDeTitreRef.nativeElement,
            this.pTitreRef.nativeElement,
            this.spanFermerRef.nativeElement,
            this.divMessageRef.nativeElement,
            this.buttonOkRef.nativeElement,
            this.buttonAnnulerRef.nativeElement
        );
    }

}
