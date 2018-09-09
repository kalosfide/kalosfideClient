import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { DialogueDef } from './dialogueDef';
import { map } from 'rxjs/operators';

const DIALOGUE_DANS_DIV = true;

/**
 * Async modal dialog service
 */
@Injectable()
export class DialogueService {

    // les éléments HTML sont liés par le DialogueComponent lors du AfterViewInit

    private dialogElement: any;
    private divFond: HTMLDivElement;
    private divBarreDeTitre: HTMLDivElement;
    private pTitre: HTMLParagraphElement;
    private spanFermer: HTMLSpanElement;
    private divMessage: HTMLDivElement;
    private buttonOk: HTMLButtonElement;
    private buttonAnnuler: HTMLButtonElement;
    private obsConfirmation: Observable<any>;

    constructor(
    ) {
    }

    get dansDivElement(): boolean {
        return DIALOGUE_DANS_DIV;
    }
    get dansDialogElement(): boolean {
        return !DIALOGUE_DANS_DIV;
    }

    fixeHtmlElements(dialogElement: any,
        divBarreDeTitre: HTMLDivElement,
        pTitre: HTMLParagraphElement,
        spanFermer: HTMLSpanElement,
        divMessage: HTMLDivElement,
        buttonOk: HTMLButtonElement,
        buttonAnnuler: HTMLButtonElement,
    ) {
        if (DIALOGUE_DANS_DIV) {
            this.divFond = dialogElement;
        } else {
            this.dialogElement = dialogElement;
        }
        this.divBarreDeTitre = divBarreDeTitre;
        this.pTitre = pTitre;
        this.spanFermer = spanFermer;
        this.divMessage = divMessage;
        this.buttonOk = buttonOk;
        this.buttonAnnuler = buttonAnnuler;
        this.obsConfirmation = fromEvent(dialogElement, 'click')
            .pipe(map(
                (event: Event) => {
                    const confirmation = event.target === this.buttonOk;
                    this.fermeDialogue();
                    return confirmation;
                }
            ));
    }

    ouvreDialogue() {
        if (DIALOGUE_DANS_DIV) {
            this.divFond.setAttribute('ouvert', '');
        } else {
            this.dialogElement.showModal();
        }
    }

    fermeDialogue() {
        if (DIALOGUE_DANS_DIV) {
            this.divFond.removeAttribute('ouvert');
        } else {
            this.dialogElement.close();
        }
    }

    get estOuvert(): boolean {
        return DIALOGUE_DANS_DIV ? !!this.divFond.getAttribute('ouvert') : this.dialogElement.open;
    }

    /**
     * Demande à l'utilisateur de répondre oui ou non à une question
     * @param titre si défini, fenêtre avec barre de titre et fermeur (x)
     * @param message si défini, précise la question
     * @param actionSiConfirmé si définie, la fonction est éxécutée avant de retourner l'observable
     */
    confirme(dialogueDef: DialogueDef): Observable<boolean> {
        if (!this.pTitre) {
            throw new Error(
                'Pour pouvoir utiliser DialogueService, le template du root component doit contenir <app-dialogue></app-dialogue>');
        }
        if (dialogueDef.titre) {
            this.pTitre.textContent = dialogueDef.titre;
            this.divBarreDeTitre.style.setProperty('display', 'block');
        } else {
            this.divBarreDeTitre.style.setProperty('display', 'none');
        }
        if (dialogueDef.message) {
            let message: string;
            if (typeof (dialogueDef.message) === 'string') {
                message = dialogueDef.message;
            } else {
                message = dialogueDef.message.join('</br>');
            }
            console.log(message);
            this.divMessage.textContent = message;
            this.divMessage.style.setProperty('display', 'block');
        } else {
            this.divMessage.style.setProperty('display', 'none');
        }
        this.buttonOk.textContent = dialogueDef.texteOk || 'Ok';
        this.buttonAnnuler.textContent = dialogueDef.texteAnnuler || 'Annuler';
        this.ouvreDialogue();
        return this.obsConfirmation;
    }

}
