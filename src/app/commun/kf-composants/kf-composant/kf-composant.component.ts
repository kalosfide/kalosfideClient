import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KfComposant } from './kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-kf-composant',
    templateUrl: './kf-composant.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfComposantComponent implements OnInit {
    @Input() composant: KfComposant;

    /**
     * permet de transmettre des évènements aux Angular components dont le template utilise des templates de KfComposantComponent
     * <app-kf-xxx [composant]="composant" (output)="fncTraite($event)"></app-kf-xxx>
     */
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    /**
     * si le template d'un KfComposantComponent utilise un template de KfComposantComponent dont le selector est app-kf-xxx
     * la fonction fncTraitement doit être traiteOuTransmet dans tous les cas sauf pour app-kf-composant où la fonction
     * fncTraitement doit être transmet car app-kf-composant utilise app-kf-xxx avec le même composant et le traitement éventuel
     * exécuté par ce composant ne doit avoir lieu qu'une fois
     */

    typeDeComposant = KfTypeDeComposant;
    typeDeValeur = KfTypeDeValeur;

    subscription: Subscription;

    constructor() {
    }

    ngOnInit() {
        if (this.composant.gereValeur && this.composant.gereHtml.suitLeStatut) {
            this.suitLeStatut();
        }
        if (this.composant.gereValeur && this.composant.gereHtml.suitLaValeur) {
            this.suitLaValeur();
        }
    }

    /**
     * crée les déclencheurs
     */
    initialiseHtml() {
        const gereHtml = this.composant.gereHtml;
        gereHtml.initialiseHtml();
        if (gereHtml.evenementsADéclencher) {
            gereHtml.evenementsADéclencher.forEach(
                htmlEventType =>
                    gereHtml.htmlElement['on' + htmlEventType] =
                    (event: Event): any => {
                        const evenement = gereHtml.transformateur(htmlEventType)(event);
                        this.output.emit(evenement);
                        switch (evenement.statut) {
                            case KfStatutDEvenement.fini:
                                event.stopPropagation();
                                break;
                            default:
                                break;
                        }
                    }
            );
        }
    }

    /**
     * transmission d'un évènement à l'Angular component qui utilise le template de ce component
     */
    transmet(evenement: KfEvenement) {
        this.output.emit(evenement);
    }
    /**
     * réémission d'un évènement après s'être substitué à l'émetteur et l'avoir empilé dans les parametres
     */
    reemet(evenement: KfEvenement) {
        evenement.emetteur = this.composant;
        this.output.emit(evenement);
    }
    /**
     * traitement ou transmission pour un composant qui n'est pas racine et qui n'est pas menu
     * traitement et réémission pour un composant qui est racine
     */
    traiteOuTransmet(evenement: KfEvenement) {
        if (evenement.statut === KfStatutDEvenement.aTraiter) {
            this.composant.gereHtml.traite(evenement);
        }
        /*
       console.log('traiteOuTransmet', this.composant, evenement);
                console.log('traiteOuTransmet:', {
                    composant: this.composant,
                    evenement: evenement.type,
                    traité: evenement.statut
                });
                console.log(KfdocumentContexte.focusComposant, KfdocumentContexte.prochainFocusComposant);
        */
        if (evenement.statut !== KfStatutDEvenement.fini) {
            this.output.emit(evenement);
        } else {
            if (this.composant.estRacine) {
                this.reemet(evenement);
            }
        }
    }

    /**
     * emet un KfEvenenment statutChange en réponse à un événement statusChanges de l'abstractControl
     */
    suitLeStatut() {
        this.composant.abstractControl.statusChanges.forEach(
            statut => {
                if (!this.composant.gereHtml.suspendSuitLeStatut) {
                    const e: KfEvenement = {
                        emetteur: this.composant,
                        type: KfTypeDEvenement.statutChange,
                        parametres: statut,
                        statut: KfStatutDEvenement.aTraiter
                    };
                    this.transmet(e);
                }
            }
        );
    }

    /**
     * emet un KfEvenenment valeurChange en réponse à un événement valueChanges de l'abstractControl
     */
    suitLaValeur() {
        this.composant.abstractControl.valueChanges.forEach(
            valeur => {
                if (!this.composant.gereHtml.suspendSuitLaValeur) {
                    const e: KfEvenement = {
                        emetteur: this.composant,
                        type: KfTypeDEvenement.valeurChange,
                        parametres: valeur,
                        statut: KfStatutDEvenement.aTraiter
                    };
                    this.traiteOuTransmet(e);
                }
            }
        );
    }

    /**
     * debug: log du composant
     */
    get debugComposant(): string {
        console.log('debugComposant', this.composant);
        return 'debugComposant';
    }

}
