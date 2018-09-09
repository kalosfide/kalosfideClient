import { Component, HostBinding, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { DialogueService } from './dialogue.service';
import { DialogueDef } from './dialogueDef';

@Component({
    selector: 'app-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: [
        './dialogue.component.css'
    ],
})
export class DialogueComponent implements OnInit, AfterViewInit {
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.position') position = 'absolute';

    @ViewChild('dialogElement') dialogElementRef: ElementRef;
    @ViewChild('dialogueBarreDeTitre') divBarreDeTitreRef: ElementRef;
    @ViewChild('dialogueTitre') pTitreRef: ElementRef;
    @ViewChild('dialogueFermer') spanFermerRef: ElementRef;
    @ViewChild('dialogueMessage') divMessageRef: ElementRef;
    @ViewChild('dialogueOk') buttonOkRef: ElementRef;
    @ViewChild('dialogueAnnuler') buttonAnnulerRef: ElementRef;

    dansDialogElement: boolean;

    constructor(
        private service: DialogueService
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
