import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { KfContenuPhrase } from './kf-contenu-phrase';
import { KfEvenement } from '../kf-evenements';

@Component({
    selector: 'app-kf-contenu-phrase',
    templateUrl: './kf-contenu-phrase.component.html',
})
export class KfContenuPhraseComponent implements AfterViewInit {
    @Input() contenuPhrase: KfContenuPhrase;
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    constructor() { }

    ngAfterViewInit() {
    }

    /**
     * transmission d'un évènement à l'Angular component qui utilise le template de ce component
     */
    transmet(evenement: KfEvenement) {
        this.contenuPhrase.composant.gereHtml.traite(evenement);
    }

}
