import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { IBoutonDef } from '../fabrique/fabrique-bouton';
import { Fabrique } from '../fabrique/fabrique';

@Component({
    selector: 'app-retour-en-haut',
    templateUrl: './retour-en-haut.component.html',
})
export class RetourEnHautComponent implements OnInit {
    windowScrolled: boolean;

    groupe: KfSuperGroupe;

    constructor(@Inject(DOCUMENT) private document: Document) { }

    @HostListener('window:scroll', [])

    onWindowScroll() {
        if (window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop > 100) {
            this.windowScrolled = true;
        } else if (this.windowScrolled && window.pageYOffset
            || this.document.documentElement.scrollTop || this.document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    retourneEnHaut() {
        let début: DOMHighResTimeStamp;
        const départ = document.documentElement.scrollTop || document.body.scrollTop;
        const date = (Date.now());
        const durée_en_s = .8;
        let q: number;
        // (1 - q^(n+1)) / (1 - q) = départ
        let arithmétique: number;
        let i = 0;
        function prochain(timeStamp: DOMHighResTimeStamp, actuel: number): number {
            let pas = actuel / 2;
            if (pas < 10) {
                pas = 10;
            }
            let nouveau: number;
            nouveau = actuel - arithmétique;
            nouveau = actuel - pas;
            if (nouveau < 10) {
                nouveau = 0;
                console.log(date, date - (Date.now()));
            }
            console.log(i++, nouveau);
            return nouveau;
        }
        function smoothscroll(timeStamp: DOMHighResTimeStamp) {
            if (!début) {
                début = timeStamp;
                const nb = (durée_en_s * 6); // 6 rafraichissements par seconde
                arithmétique = départ / nb;
                console.log(nb, arithmétique);
            }
            const écoulé_en_ms = timeStamp - début;
            const actuel = document.documentElement.scrollTop || document.body.scrollTop;
            if (actuel > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, prochain(timeStamp, actuel));
            }
        }
        window.requestAnimationFrame(smoothscroll);
    }

    ngOnInit() {
        this.groupe = new KfSuperGroupe('retour-en-haut');
        this.groupe.ajouteClasseDef('retour-en-haut', { nom: 'retour-en-haut-montre', active: () => this.windowScrolled });
        const def: IBoutonDef = {
            nom: 'retour-en-haut',
            action: () => this.retourneEnHaut(),
            contenu: {
                icone: Fabrique.icone.retourEnHaut()
            },
            bootstrapType: 'dark'
        };
        this.groupe.ajoute(Fabrique.bouton.bouton(def));
    }
}
