import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { SitePages } from './site-pages';
import { PageDef } from '../commun/page-def';
import { SiteBaseComponent } from './site-base.component';
import { Router } from '@angular/router';

@Component({
    templateUrl: './site-base.html',
})
export class SiteCommandesComponent extends SiteBaseComponent implements OnInit {

    static _pageDef: PageDef = SitePages.commandes;
    pageDef: PageDef = SitePages.commandes;

    actionClient = `composer un bon de commande et l'envoyer au fournisseur. `
        + `Le bon est modifiable jusqu\'à ce que le fournisseur commence la préparation de la livraison.`;
    actionFournisseur = `cloturer les bons de commande que ces clients lui ont envoyé. `
        + `Il peut choisir de refuser certains bons.`;

    texte = `Après cet accusé de reception du fournisseur, les bons de commande sont consultables dans le menu Documents. `
        + `La création des bons de livraison pour les  a lieu dans le menu Livraisons`;

    constructor(
        protected router: Router,
        protected service: NavigationService,
    ) {
        super(router, service);
    }

    ngOnInit() {
        this.ngOnInit_Site();
    }

}
