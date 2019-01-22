import { Component, OnInit, OnDestroy } from '@angular/core';

import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { Router, ActivatedRoute, Data, RouterStateSnapshot } from '@angular/router';
import { Site } from '../../modeles/site';
import { PageDef } from '../../commun/page-def';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { Identifiant } from '../../securite/identifiant';
import { CommandeVue } from './commande';
import { CommandePages, CommandeRoutes } from './commande-pages';
import { CommandeLigne, CommandeLigneEnTetes } from './commande-ligne';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { CommandeService } from './commande.service';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfVueTable, KfVueCelluleDef } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';
import { FormulaireBaseComponent } from '../../disposition/formulaire/formulaire-base.component';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { ComponentAAutoriserAQuitter } from '../../commun/peut-quitter/peut-quitter-garde.service';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseDEtiquette } from 'src/app/commun/kf-composants/kf-composants-types';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class CommandeEnvoiComponent extends FormulaireBaseComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    static _pageDef: PageDef = CommandePages.envoi;
    pageDef: PageDef = CommandePages.envoi;

    get titre(): string {
        return `${this.pageDef.titre} no: ${this.commande.no}`;
    }

    site: Site;
    identifiant: Identifiant;

    commande: CommandeVue;
    terminé = false;

    lignesAvecDemande(): CommandeLigne[] {
        return this.commande.lignes.filter(l => l.demande > 0);
    }

    actionSiOk = (): void => {
        this.terminé = true;
        this.router.navigate([CommandeRoutes.url(this.site.nomSite, CommandePages.termine.urlSegment)]);
    }
    soumission = (): Observable<ApiResult> => {
        return this.service.envoieBon(this.commande.no, this.lignesAvecDemande());
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: CommandeService,
        protected attenteAsyncService: AttenteAsyncService,
        private peutQuitterService: PeutQuitterService
    ) {
        super(service, attenteAsyncService);
    }

    get urlPageProduits(): string {
        return CommandeRoutes.url(this.site.nomSite, CommandePages.produits.urlSegment);
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (this.lignesAvecDemande().length === 0 || this.commande.inchangé) {
            return true;
        }
        if (!this.terminé && (!nextState || nextState.url !== CommandeRoutes.url(this.site.nomSite, CommandePages.produits.urlSegment))) {
            return this.peutQuitterService.confirme(this.pageDef.titre);
        }
        return true;
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.identifiant = this.service.identification.litIdentifiant();

        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.commande = data.commande;
                this.créeFormulaire();
            }
        ));
    }

    créeGroupeFermé(): KfGroupe {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-primary');
        let texte = new KfEtiquette('',
            ` Arrêté: ${this.commande.date.toLocaleDateString('fr-FR')} ${this.commande.date.toLocaleTimeString('fr-FR')}`);
        texte.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        groupe.ajoute(texte);
        texte = new KfEtiquette('',
            'Le traitement de ce bon de commande a commencé. Vous pouvez le suivre dans les Livraisons.');
        texte.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        groupe.ajoute(texte);
        texte = new KfEtiquette('',
            'Vous ne pouvez plus le modifier. Pour créer un nouveau bon de commande');
        texte.baliseHTML = KfTypeDeBaliseDEtiquette.P;
        groupe.ajoute(texte);
        const boutonCopier = new KfBouton('copier', 'Copier ce bon');
        boutonCopier.ajouteClasseDef('btn btn-primary');
        const boutonVide = new KfBouton('copier', 'Créer un bon vide');
        boutonVide.ajouteClasseDef('btn btn-primary');
        groupe.ajouteBoutonsDeFormulaire([boutonCopier, boutonVide]);
        groupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                if (evenement.emetteur === boutonCopier) {
                    this.créeCopie();
                    evenement.statut = KfStatutDEvenement.fini;
                } else {
                    if (evenement.emetteur === boutonVide) {
                        this.créeVide();
                        evenement.statut = KfStatutDEvenement.fini;
                    }
                }
            });
        return groupe;
    }

    créeVueTable(lignes: CommandeLigne[]): KfVueTable<CommandeLigne> {
        const vueTable = new KfVueTable(this.nom + '_table', {
            enTetes: CommandeLigneEnTetes,
            cellules: (ligne: CommandeLigne): KfVueCelluleDef[] => ligne.cellules
        });
        vueTable.remplitLignes(lignes);
        return vueTable;
    }

    créeFormulaire() {
        this.formulaire = new KfSuperGroupe(this.nom);
        const lignes = this.lignesAvecDemande();
        if (this.commande.livraisonNo) {
            this.formulaire.ajoute(this.créeGroupeFermé());
            this.formulaire.ajoute(this.créeVueTable(lignes));
        } else {
            const boutonProduits = new KfBouton('produits', CommandePages.produits.lien);
            if (lignes.length === 0) {
                const resultatListeVide = new KfAfficheResultat('listevide');
                const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Avertissement, 'Il n\'a pas de lignes de commande.');
                resultatListeVide.finit(resultat);
                this.formulaire.ajoute(resultatListeVide);
                boutonProduits.ajouteClasseDef('btn', 'btn-primary');
                this.formulaire.ajouteBoutonsDeFormulaire([boutonProduits]);
            } else {
                this.formulaire.ajoute(this.créeVueTable(lignes));
                boutonProduits.ajouteClasseDef('btn', 'btn-secundary');
                const boutonSoumettre = this.créeBoutonSoumettre('Envoyer le bon de commande');
                this.formulaire.ajouteBoutonsDeFormulaire([boutonProduits, boutonSoumettre]);
            }
            this.formulaire.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
                (evenement: KfEvenement) => {
                    if (evenement.emetteur === boutonProduits) {
                        evenement.statut = KfStatutDEvenement.fini;
                        this.router.navigate([this.urlPageProduits]);
                    }
                });
        }
        this.formulaire.quandTousAjoutés();
    }

    créeCopie() {
        this.commande.no++;
        this.commande.date = undefined;
        this.commande.livraisonNo = undefined;
        this.créeFormulaire();
    }

    créeVide() {
        this.commande.lignes.forEach(l => l.initialise());
        this.créeCopie();
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
