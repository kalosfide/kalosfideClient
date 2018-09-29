import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfGroupe } from './kf-groupe';
import { KfTypeDHTMLEvents } from '../kf-partages/kf-evenements';
import { KfSuperGroupe } from './kf-super-groupe';

@Component({
    selector: 'app-kf-groupe',
    templateUrl: './kf-groupe.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfGroupeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement') domElementRef: ElementRef;

    typeDeComposant = KfTypeDeComposant;
    typeDeValeur = KfTypeDeValeur;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.domElementRef.nativeElement;
        this.initialiseHtml();

//        console.log(this.evenements());
    }

    evenements(): any {

        let l: string;
        l = `    onabort: (this: HTMLElement, ev: UIEvent) => any;
        onactivate: (this: HTMLElement, ev: UIEvent) => any;
        onbeforeactivate: (this: HTMLElement, ev: UIEvent) => any;
        onbeforecopy: (this: HTMLElement, ev: ClipboardEvent) => any;
        onbeforecut: (this: HTMLElement, ev: ClipboardEvent) => any;
        onbeforedeactivate: (this: HTMLElement, ev: UIEvent) => any;
        onbeforepaste: (this: HTMLElement, ev: ClipboardEvent) => any;
        onblur: (this: HTMLElement, ev: FocusEvent) => any;
        oncanplay: (this: HTMLElement, ev: Event) => any;
        oncanplaythrough: (this: HTMLElement, ev: Event) => any;
        onchange: (this: HTMLElement, ev: Event) => any;
        onclick: (this: HTMLElement, ev: MouseEvent) => any;
        oncontextmenu: (this: HTMLElement, ev: PointerEvent) => any;
        oncopy: (this: HTMLElement, ev: ClipboardEvent) => any;
        oncuechange: (this: HTMLElement, ev: Event) => any;
        oncut: (this: HTMLElement, ev: ClipboardEvent) => any;
        ondblclick: (this: HTMLElement, ev: MouseEvent) => any;
        ondeactivate: (this: HTMLElement, ev: UIEvent) => any;
        ondrag: (this: HTMLElement, ev: DragEvent) => any;
        ondragend: (this: HTMLElement, ev: DragEvent) => any;
        ondragenter: (this: HTMLElement, ev: DragEvent) => any;
        ondragleave: (this: HTMLElement, ev: DragEvent) => any;
        ondragover: (this: HTMLElement, ev: DragEvent) => any;
        ondragstart: (this: HTMLElement, ev: DragEvent) => any;
        ondrop: (this: HTMLElement, ev: DragEvent) => any;
        ondurationchange: (this: HTMLElement, ev: Event) => any;
        onemptied: (this: HTMLElement, ev: Event) => any;
        onended: (this: HTMLElement, ev: MediaStreamErrorEvent) => any;
        onerror: (this: HTMLElement, ev: ErrorEvent) => any;
        onfocus: (this: HTMLElement, ev: FocusEvent) => any;
        oninput: (this: HTMLElement, ev: Event) => any;
        oninvalid: (this: HTMLElement, ev: Event) => any;
        onkeydown: (this: HTMLElement, ev: KeyboardEvent) => any;
        onkeypress: (this: HTMLElement, ev: KeyboardEvent) => any;
        onkeyup: (this: HTMLElement, ev: KeyboardEvent) => any;
        onload: (this: HTMLElement, ev: Event) => any;
        onloadeddata: (this: HTMLElement, ev: Event) => any;
        onloadedmetadata: (this: HTMLElement, ev: Event) => any;
        onloadstart: (this: HTMLElement, ev: Event) => any;
        onmousedown: (this: HTMLElement, ev: MouseEvent) => any;
        onmouseenter: (this: HTMLElement, ev: MouseEvent) => any;
        onmouseleave: (this: HTMLElement, ev: MouseEvent) => any;
        onmousemove: (this: HTMLElement, ev: MouseEvent) => any;
        onmouseout: (this: HTMLElement, ev: MouseEvent) => any;
        onmouseover: (this: HTMLElement, ev: MouseEvent) => any;
        onmouseup: (this: HTMLElement, ev: MouseEvent) => any;
        onmousewheel: (this: HTMLElement, ev: WheelEvent) => any;
        onmscontentzoom: (this: HTMLElement, ev: UIEvent) => any;
        onmsmanipulationstatechanged: (this: HTMLElement, ev: MSManipulationEvent) => any;
        onpaste: (this: HTMLElement, ev: ClipboardEvent) => any;
        onpause: (this: HTMLElement, ev: Event) => any;
        onplay: (this: HTMLElement, ev: Event) => any;
        onplaying: (this: HTMLElement, ev: Event) => any;
        onprogress: (this: HTMLElement, ev: ProgressEvent) => any;
        onratechange: (this: HTMLElement, ev: Event) => any;
        onreset: (this: HTMLElement, ev: Event) => any;
        onscroll: (this: HTMLElement, ev: UIEvent) => any;
        onseeked: (this: HTMLElement, ev: Event) => any;
        onseeking: (this: HTMLElement, ev: Event) => any;
        onselect: (this: HTMLElement, ev: UIEvent) => any;
        onselectstart: (this: HTMLElement, ev: Event) => any;
        onstalled: (this: HTMLElement, ev: Event) => any;
        onsubmit: (this: HTMLElement, ev: Event) => any;
        onsuspend: (this: HTMLElement, ev: Event) => any;
        ontimeupdate: (this: HTMLElement, ev: Event) => any;
        onvolumechange: (this: HTMLElement, ev: Event) => any;
        onwaiting: (this: HTMLElement, ev: Event) => any;
    `;
        let ts: any[] = l.split('\n');
        ts = ts.map((s: string) => s.trim()).filter((s: string) => s !== '').map(
            (s: string) => {
                let pos = s.indexOf(': ');
                const nom = s.substring(2, pos);
                const signature = s.substring(pos + 2, s.length - 1);
                pos = signature.indexOf('ev: ');
                const fin = signature.indexOf(')');
                const type = signature.substring(pos + 4, fin);
                return {
                    nom: nom,
                    signature: signature,
                    type: type,
                };
            }
        );

        let texteEnum = 'export enum HTMLEventsNames {\n';
        ts.forEach(
            (s: { nom: string, signature: string,
                    type: string }) => {
                texteEnum = texteEnum + '    ' + s.nom + ' = \'' + s.nom + '\',\n';
            }
        );
        texteEnum  = texteEnum + '}\n';
        let texteType = 'export enum HTMLEventsTypess {\n';
        ts.forEach(
            (s: { nom: string, signature: string,
                    type: string }) => {
                texteType = texteType + '    ' + s.nom + ' = ' + s.type + ',\n';
            }
        );
        texteType  = texteType + '}\n';
        let texteInterface = 'export interface KFTraiteHTMLEvents {\n';
        ts.forEach(
            (s: { nom: string, signature: string, type: string }) => {
                texteInterface = texteInterface + '    ' + s.nom + '?: ' + s.signature + ';\n';
            }
        );
        texteInterface = texteInterface + '}\n';

        const parEventType: { type: string, events: KfTypeDHTMLEvents[] }[] = [];
        ts.forEach(
            (s: { nom: string, signature: string, type: string }) => {
                const kftype = s.nom as KfTypeDHTMLEvents;
                const pt = parEventType.find(pet => pet.type === s.type);
                if (pt) {
                    pt.events.push(kftype);
                } else {
                    parEventType.push({ type: s.type, events: [kftype]});
                }
            }
        );
        return parEventType;
    }

}
