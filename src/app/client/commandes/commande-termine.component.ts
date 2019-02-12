import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PageDef } from '../../commun/page-def';
import { Site } from '../../modeles/site';
import { CommandePages } from './commande-pages';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { SitePages } from '../../site/site-pages';
import { ComptePages } from '../../compte/compte-pages';
import { ClientRoutes } from '../client-pages';
import { NavigationService } from 'src/app/services/navigation.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class CommandeTermineComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = CommandePages.termine;
    pageDef: PageDef = CommandePages.termine;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    constructor(
        protected router: Router,
        private navigation: NavigationService,
    ) {
        super();
    }

    ngOnInit() {
        this.site = this.navigation.siteEnCours;
        this.superGroupe = new KfSuperGroupe(this.nom);
        const afficheResultat = new KfAfficheResultat('resultat');
        afficheResultat.finit(new KfResultatAffichable(KfTypeResultatAffichable.Ok, 'Le bon de commande a bien été enregistré.'));
        this.superGroupe.ajoute(afficheResultat);
        let etiquette = new KfEtiquette('', 'Le fournisseur le verra dans sa liste de bons de commande à traiter.');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        this.superGroupe.ajoute(etiquette);
        etiquette = new KfEtiquette('', `Vous pourrez suivre son traitement sur la page ${SitePages.livraisons.lien}.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        this.superGroupe.ajoute(etiquette);
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('form-group btn-group form-inline');
        etiquette = new KfEtiquette('', 'Si vous avez terminé, pensez à vous déconnecter.');
        groupe.ajoute(etiquette);
        const lien = Fabrique.lienBouton(ComptePages.deconnection, ClientRoutes, this.site.nomSite);
        groupe.ajoute(lien);
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }
}
