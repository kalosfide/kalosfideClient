import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-texte';
import { KfCaseACocher } from '../../commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';

import { CompteService } from '../compte.service';
import { IdentificationService } from '../../securite/identification.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { ApiResult } from '../../commun/api-results/api-result';
import { ComptePages, CompteRoutes } from '../compte-pages';


import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageDef } from 'src/app/commun/page-def';
import { SiteRoutes } from 'src/app/site/site-pages';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Identifiant } from 'src/app/securite/identifiant';
import { VisiteurPages, VisiteurRoutes } from 'src/app/visiteur/visiteur-pages';
import { AppSiteRoutes, AppSitePages } from 'src/app/app-site/app-site-pages';
import { RouteurService } from 'src/app/services/routeur.service';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class ConnectionComponent extends FormulaireComponent {

    static _pageDef: PageDef = ComptePages.connection;
    pageDef: PageDef = ComptePages.connection;

    identifiant: Identifiant;

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettre('Se connecter')];

    soumission = (): Observable<ApiResult> => {
        this.identifiant = this.identification.litIdentifiant();
        return this.service.connecte(this.valeur);
    }

    actionSiOk = (): void => {
        const identifiant = this.identification.litIdentifiant();
        const urlPrécédente = this.navigation.urlPrécédente();
        const details = SiteRoutes.nomSite_Base(urlPrécédente);
        let nomSite: string;
        if (details) {
            nomSite = details[0];
        }
        // s'il n'y a pas de site en cours ou si l'identifiant est visiteur du site en cours
        if (!nomSite || !identifiant.estUsagerDeNomSite(nomSite)) {
            nomSite = identifiant.nomSiteParDéfaut;
        }
        this.routeur.navigate([SiteRoutes.urlSite(nomSite, identifiant)]);
    }

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
        private navigation: NavigationService,
        protected service: CompteService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, attenteAsyncService);

        this.titreRésultatErreur = 'Connection impossible';
    }

    créeEdition = (): KfGroupe => {
        const groupe = new KfGroupe('donnees');
        groupe.créeGereValeur();
        const nom = new KfTexte('userName', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        groupe.ajoute(nom);
        const password = new KfTexte('password', 'Mot de passe');
        password.typeDInput = KfTypeDInput.password;
        password.AjouteValidateur(KfValidateurs.required);
        groupe.ajoute(password);
        const persistant = new KfCaseACocher('persistant', 'Rester connecté');
        persistant.valeur = false;
        groupe.ajoute(persistant);
        const site = this.navigation.siteEnCours;
        if (site) {
            this.lienRetour = new KfLien('lienRetour', VisiteurRoutes.url(site.nomSite, [VisiteurPages.devenirClient.urlSegment]),
                'Pas de compte ? Devenez client de ' + site.nomSite);
        } else {
            this.lienRetour = new KfLien('lienRetour', AppSiteRoutes.url([AppSitePages.devenirFournisseur.urlSegment]),
                'Pas de compte ? Devenez fournisseur.');
        }

        return groupe;
    }

}
