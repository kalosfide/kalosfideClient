import { Component, HostBinding, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { KfDialogueService } from './kf-dialogue.service';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfComposant } from '../kf-composant/kf-composant';

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

    @ViewChild('dialogElement') dialogElementRef: ElementRef;
    @ViewChild('dialogueBarreDeTitre') divBarreDeTitreRef: ElementRef;
    @ViewChild('dialogueTitre') pTitreRef: ElementRef;
    @ViewChild('dialogueFermer') spanFermerRef: ElementRef;
    @ViewChild('dialogueMessage') divMessageRef: ElementRef;
    @ViewChild('dialogueOk') buttonOkRef: ElementRef;
    @ViewChild('dialogueAnnuler') buttonAnnulerRef: ElementRef;

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
