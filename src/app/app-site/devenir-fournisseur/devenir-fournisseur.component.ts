import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { FormulaireAEtapesComponent } from '../../disposition/formulaire/formulaire-a-etapes.component';
import { ApiResult } from '../../commun/api-results/api-result';

import { IdentificationService } from '../../securite/identification.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { FournisseurEditeur } from '../../fournisseur/fournisseur';
import { DevenirFournisseurModel } from './devenir-fournisseur-model';
import { DevenirFournisseurService } from './devenir-fournisseur.service';
import { SiteRoutes } from 'src/app/site/site-pages';
import { PageDef } from 'src/app/commun/page-def';
import { FormulaireAEtapeService } from 'src/app/disposition/formulaire/formulaire-a-etapes.service';
import { DevenirFournisseurPages, DevenirFournisseurRoutes } from './devenir-fournisseur-pages';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe/mot-de-passe';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { AppSite } from 'src/app/app-site/app-site';
import { SiteEditeur } from 'src/app/fournisseur/f-site/site-editeur';
import { RouteurService } from 'src/app/services/routeur.service';
import { AppSitePages } from '../app-site-pages';
import { DevenirConnectionEditeur } from 'src/app/compte/devenir/devenir-connection-model';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';

@Component({
    templateUrl: '../../disposition/formulaire/formulaire-a-etapes.component.html',
    styles: []
})
export class DevenirFournisseurComponent extends FormulaireAEtapesComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    static _pageDef: PageDef = AppSitePages.devenirFournisseur;
    pageDef: PageDef = AppSitePages.devenirFournisseur;

    get titre(): string {
        return `${AppSite.titre} - ${AppSitePages.devenirFournisseur.titre}`;
    }

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettre(`S'enregistrer`)];

    soumission = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        const model = new DevenirFournisseurModel();
        model.email = valeur['email'];
        model.password = valeur['password'];
        model.copieData(valeur);
        console.log(model);
        return this.service.enregistreFournisseur(model);
    }

    actionSiOk = (): void => {
        const sites = this.identification.litIdentifiant().sites;
        const site = sites[sites.length - 1];
        this.routeur.naviguePageDef(FournisseurPages.accueil, FournisseurRoutes, site.nomSite);
    }

    constructor(
        protected route: ActivatedRoute,
        protected routeur: RouteurService,
        private identification: IdentificationService,
        protected service: DevenirFournisseurService,
        protected attenteAsyncService: AttenteAsyncService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(routeur, service, attenteAsyncService, etapesService, peutQuitterService);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
        this.ajouteEtape(DevenirFournisseurPages.connection, new DevenirConnectionEditeur(service));
        this.ajouteEtape(DevenirFournisseurPages.profil, new FournisseurEditeur());
        this.ajouteEtape(DevenirFournisseurPages.site, new SiteEditeur());
        const contenus = this.contenusValidationParDéfaut();
        this.ajouteEtape(DevenirFournisseurPages.validation, { créeContenus() { return contenus; } });
    }

    ngOnInit() {
        this.route.data.subscribe((data: { motDePasse: ReglesDeMotDePasse }) => {
            this.créeFormulaire();
            const éditeur = this.etapes[0].éditeur as DevenirConnectionEditeur;
            éditeur.kfTexteDuMotDePasse.gereValeur.FixeValidateurs(ReglesDeMotDePasse.créeValidateurs(data.motDePasse));
        });
        this.ngOnInit_Index();
    }


    construitUrl(routeEtape: string): string {
        return DevenirFournisseurRoutes.url(routeEtape);
    }

}
