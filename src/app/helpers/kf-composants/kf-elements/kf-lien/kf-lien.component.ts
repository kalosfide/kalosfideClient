import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KfFichier } from '../kf-fichier/kf-fichier';
import { KfLien } from './kf-lien';
import { DialogueService } from '../../../dialogue/dialogue.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-kf-lien',
    template: `
    <ng-template #avecConfirme>
        <a #baliseElement (click)="confirme()" [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </a>
    </ng-template>
    <ng-template #sansConfirme>
        <a #baliseElement [routerLink]="composant.route" routerLinkActive="kf-choisi" [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </a>
    </ng-template>
    <ng-template #actif>
        <ng-container *ngIf="composant.avecConfirme; then avecConfirme; else sansConfirme"></ng-container>
    </ng-template>
    <ng-template #inactif>
        <a #baliseElement [class]="composant.classe">
            <app-kf-texte-image  [texteImage]="composant.texteImage"></app-kf-texte-image>
        </a>
    </ng-template>
    <ng-container *ngIf="composant.inactif; then inactif; else actif"></ng-container>
`,
})
export class KfLienComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement') baliseElementRef: ElementRef;

    constructor(
        private dialogueService: DialogueService,
        private router: Router
    ) {
        super();
    }

    get lien(): KfLien {
        return this.composant as KfLien;
    }

    get avecConfirme(): boolean {
        return this.lien.avecConfirme;
    }

    confirme() {
        if (this.lien.avecConfirme) {
            this.dialogueService.confirme(this.lien.dialogueConfirme).pipe(take(1)).subscribe(
                (confirmation: boolean) => {
                    if (confirmation) {
                        if (this.lien.actionSiConfirme) {
                            this.lien.actionSiConfirme();
                        }
                        this.router.navigate([this.lien.route]);
                    }
                }
            );
        }
    }


ngOnInit() {
}

ngAfterViewInit() {
    this.composant.gereHtml.htmlElement = this.baliseElementRef.nativeElement;
    this.initialiseHtml();
}

}
