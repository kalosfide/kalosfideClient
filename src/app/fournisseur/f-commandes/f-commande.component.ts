import { Component, OnInit, OnDestroy } from '@angular/core';

import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Site } from '../../modeles/site';
import { PageDef } from '../../commun/page-def';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { Identifiant } from '../../securite/identifiant';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfVueTable, KfVueCelluleDef, KfVueTableDef } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';
import { FormulaireBaseComponent } from '../../disposition/formulaire/formulaire-base.component';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { KfTypeDEvenement, KfEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { FCommandePages, FCommandeRoutes } from './f-commande-pages';
import { FCommandeService } from './f-commande.service';
import { FCommandeLigne, FCommandeEnTetes } from './f-commande';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class FCommandeComponent extends FormulaireBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FCommandePages.reception;
    pageDef: PageDef = FCommandePages.reception;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;
    identifiant: Identifiant;

    vueTableDef: KfVueTableDef<FCommandeLigne> = {
        enTetes: FCommandeEnTetes,
        cellules: (ligne: FCommandeLigne): KfVueCelluleDef[] => ligne.cellulesEditables,
        superGroupe: (ligne: FCommandeLigne): KfSuperGroupe => ligne.superGroupe
    };

    commandes: FCommandeLigne[];
    terminé = false;

    commandesAcceptées(): FCommandeLigne[] {
        return this.commandes.filter(l => l.accepte);
    }

    actionSiOk = (): void => {
        const commandes = this.commandes.filter(l => !l.accepte);
        if (commandes.length === 0) { }
        this.terminé = true;
        this.router.navigate([FCommandeRoutes.url(this.site.nomSite, FCommandePages.reception.urlSegment)]);
    }
    soumission = (): Observable<ApiResult> => {
        return this.service.accepte(this.site, this.commandes.map(l => l.créeFCommandeDetail()));
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: FCommandeService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, attenteAsyncService);
    }

    ngOnInit() {
        const vueTable = new KfVueTable<FCommandeLigne>(this.nom + '_table', this.vueTableDef);
        this.site = this.service.navigation.siteEnCours;
        this.identifiant = this.service.identification.litIdentifiant();

        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.commandes = data.commandes;
                this.formulaire = new KfSuperGroupe(this.nom);
                this.formulaire.créeGereValeur();
                const boutons = [];
                if (this.commandes.length === 0) {
                    const resultatListeVide = new KfAfficheResultat('listevide');
                    const resultat = new KfResultatAffichable(
                        KfTypeResultatAffichable.Avertissement, 'Il n\'a pas de nouveaux bons de commande.');
                    resultatListeVide.finit(resultat);
                    this.formulaire.ajoute(resultatListeVide);
                } else {
                    vueTable.initialise(this.commandes);
                    this.formulaire.ajoute(vueTable);
                    const boutonSoumettre = this.créeBoutonSoumettre('Accepter les bons de commande sélectionnés');
                    boutons.push(boutonSoumettre);
                }
                this.formulaire.ajouteBoutonsDeFormulaire(boutons);
                this.formulaire.quandTousAjoutés();
            }
        ));
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            this.soumet();
        }
    }
}
