import { Component } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from './app-site-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSite } from './app-site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteContactComponent extends PageBaseComponent {

    static _pageDef: PageDef = AppSitePages.contact;
    pageDef: PageDef = AppSitePages.contact;

    get titre(): string {
        return `Contacter ${AppSite.titre}`;
    }

    constructor() {
        super();
        this.créeContenus();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(new KfEtiquette('texte', 'contact works!'));
    }

}
