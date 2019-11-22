import { Component, OnInit } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTexte } from './kf-texte';
import { KfBalise } from '../../kf-partages/kf-balise/kf-balise';

@Component({
    selector: 'app-kf-texte',
    templateUrl: './kf-texte.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfTexteComponent extends KfComposantComponent implements OnInit {

    private _balise: KfBalise;

    ngOnInit() {
        if (this.texte.balisesAAjouter) {
            let b: KfBalise = new KfBalise();
            b.baliseHTML = this.texte.balisesAAjouter[0];
            b.contenuTexte = this.texte.texte;
            b.suitLaVisiblité(this.texte);
            if (this.texte.avecClassesOuStyle) {
                b.copieClassesEtStyle(this.texte);
            }
            b.afterViewInit = (htmlElement: HTMLElement) => {
                if (htmlElement) {
                    this.composant.gereHtml.htmlElement = htmlElement;
                }
                this.composant.gereHtml.initialiseHtml(this.output);
            };
            for (let index = 1; index < this.texte.balisesAAjouter.length; index++) {
                const b1 = new KfBalise();
                b.baliseHTML = this.texte.balisesAAjouter[index];
                b1.contenuBalise = b;
                b = b1;
            }
            this._balise = b;
        }
    }

    get texte(): KfTexte {
        return this.composant as KfTexte;
    }

    get balise(): KfBalise {
        return this._balise;
    }

    get suiviDeSaut(): boolean {
        return this.composant.suiviDeSaut;
    }
}
