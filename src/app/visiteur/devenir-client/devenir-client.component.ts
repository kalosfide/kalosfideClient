import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { FormulaireAEtapesComponent } from '../../disposition/formulaire/formulaire-a-etapes.component';
import { ApiResult } from '../../commun/api-results/api-result';
import { IdentificationService } from '../../securite/identification.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { DevenirClientModel } from './devenir-client-model';
import { ClientEditeur } from 'src/app/client/client';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageDef } from 'src/app/commun/page-def';
import { FormulaireAEtapeService } from 'src/app/disposition/formulaire/formulaire-a-etapes.service';
import { DevenirClientPages, DevenirClientRoutes } from './devenir-client-pages';
import { Site } from 'src/app/modeles/site';
import { DevenirClientService } from './devenir-client.service';
import { DevenirConnectionEditeur } from 'src/app/compte/devenir/devenir-connection-model';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe/mot-de-passe';
import { VisiteurPages } from 'src/app/visiteur/visiteur-pages';
import { RouteurService } from 'src/app/services/routeur.service';
import { ClientRoutes, ClientPages } from 'src/app/client/client-pages';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';

@Component({
    templateUrl: '../../disposition/formulaire/formulaire-a-etapes.component.html',
    styles: []
})
export class DevenirClientComponent extends FormulaireAEtapesComponent implements OnInit {

    static _pageDef: PageDef = VisiteurPages.devenirClient;
    pageDef: PageDef = VisiteurPages.devenirClient;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettre(`S'enregistrer`)];

    soumission = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        const model = new DevenirClientModel();
        model.email = valeur['email'];
        model.password = valeur['password'];
        model.siteUid = this.site.uid;
        model.siteRno = this.site.rno;
        model.copieData(valeur);
        console.log(model);
        return this.service.enregistreClient(model);
    }

    actionSiOk = (): void => {
        const roles = this.identification.litIdentifiant().roles;
        const site = roles[roles.length - 1].nomSite;
        this.routeur.navigate([ClientRoutes.url(site, [ClientPages.accueil.urlSegment])]);
    }

    constructor(
        protected navigationService: NavigationService,
        protected routeur: RouteurService,
        protected route: ActivatedRoute,
        private identification: IdentificationService,
        protected service: DevenirClientService,
        protected attenteAsyncService: AttenteAsyncService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(routeur, service, attenteAsyncService, etapesService, peutQuitterService);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
        this.ajouteEtape(DevenirClientPages.connection, new DevenirConnectionEditeur(service));
        this.ajouteEtape(DevenirClientPages.profil, new ClientEditeur());
        const contenus = this.contenusValidationParDéfaut();
        this.ajouteEtape(DevenirClientPages.validation, { créeContenus() { return contenus; } });
    }

    construitUrl(routeEtape: string): string {
        return DevenirClientRoutes.url(this.site.nomSite, routeEtape);
    }

    ngOnInit() {
        this.site = this.navigationService.siteEnCours;
        this.route.data.subscribe((data: { motDePasse: ReglesDeMotDePasse }) => {
            this.créeFormulaire();
            const éditeur = this.etapes[0].éditeur as DevenirConnectionEditeur;
            éditeur.kfTexteDuMotDePasse.gereValeur.FixeValidateurs(ReglesDeMotDePasse.créeValidateurs(data.motDePasse));
        });
        this.ngOnInit_Index();
    }

}
