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
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfNav } from 'src/app/commun/kf-composants/kf-nav/kf-nav';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';

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

    private get urlProduits(): KfTexteDef {
        return Fabrique.url(CommandePages.produits, CommandeRoutes, () => this.site.nomSite);
    }

    actionSiOk = (): void => {
        this.terminé = true;
        this.router.navigate([this.urlProduits]);
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

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (this.lignesAvecDemande().length === 0 || this.commande.inchangé) {
            return true;
        }
        if (!this.terminé && (!nextState || nextState.url !== this.urlProduits)) {
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

    créeEtiquetteArrêté(): KfEtiquette {
        const texte = new KfEtiquette('',
            ` Arrêté: ${this.commande.date.toLocaleDateString('fr-FR')} ${this.commande.date.toLocaleTimeString('fr-FR')}`);
        texte.baliseHtml = KfTypeDeBaliseHTML.p;
        return texte;
    }

    créeGroupeAnnulé(): KfGroupe {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-warning');
        let texte = this.créeEtiquetteArrêté();
        groupe.ajoute(texte);
        texte = new KfEtiquette('',
            'Le fournisseur a annulé ce bon de commande.');
        texte.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(texte);
        return groupe;
    }

    créeGroupeAccepté(): KfGroupe {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-success');
        let texte = this.créeEtiquetteArrêté();
        groupe.ajoute(texte);
        texte = new KfEtiquette('',
            'Le traitement de ce bon de commande a commencé. Vous pouvez le suivre dans les Livraisons.');
        texte.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(texte);
        return groupe;
    }

    créeGroupeCréer(): KfGroupe {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-primary');
        const texte = new KfEtiquette('',
            'Pour créer un nouveau bon de commande vous pouvez copier le précédent.');
        texte.baliseHtml = KfTypeDeBaliseHTML.p;
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

    créeGroupeFermé(): KfGroupe {
        const groupe = new KfGroupe('');
        if (this.commande.etat === 'R') {
            groupe.ajoute(this.créeGroupeAnnulé());
        } else {
            groupe.ajoute(this.créeGroupeAccepté());
        }
        groupe.ajoute(this.créeGroupeCréer());
        return groupe;
    }

    créeVueTable(lignes: CommandeLigne[]): KfVueTable<CommandeLigne> {
        const vueTable = Fabrique.vueTable(this.nom, {
            enTetesDef: CommandeLigneEnTetes,
            cellules: (ligne: CommandeLigne): KfVueCelluleDef[] => ligne.cellules
        });
        vueTable.initialise(lignes);
        return vueTable;
    }

    créeNavProduits(texte: string, classe: string): KfNav {
        const nav = new KfNav('navProduits');
        const lien = Fabrique.lienBouton(CommandePages.produits, CommandeRoutes, this.site.nomSite);
        lien.fixeTexte(texte);
        lien.ajouteClasseDef(classe, 'nav-link');
        nav.ajoute(lien);
        return nav;
    }

    créeFormulaire() {
        this.formulaire = new KfSuperGroupe(this.nom);
        const lignes = this.lignesAvecDemande();
        if (this.commande.livraisonNo) {
            this.formulaire.ajoute(this.créeGroupeFermé());
            this.formulaire.ajoute(this.créeVueTable(lignes));
        } else {
            if (lignes.length === 0) {
                const resultatListeVide = new KfAfficheResultat('listevide');
                const resultat = new KfResultatAffichable(KfTypeResultatAffichable.Avertissement, 'Il n\'a pas de lignes de commande.');
                resultatListeVide.finit(resultat);
                this.formulaire.ajoute(resultatListeVide);
                const nav = this.créeNavProduits('Ajouter', 'btn btn-primary');
                this.formulaire.ajoute(nav);
            } else {
                this.formulaire.ajoute(this.créeVueTable(lignes));
                const nav = this.créeNavProduits('Modifier', 'btn btn-link');
                this.formulaire.ajoute(nav);
                const boutonSoumettre = this.créeBoutonSoumettre('Envoyer');
                this.formulaire.ajouteBoutonsDeFormulaire([boutonSoumettre]);
            }
        }
        this.formulaire.quandTousAjoutés();
    }

    créeCopie() {
        this.commande.no++;
        this.commande.date = undefined;
        this.commande.livraisonNo = undefined;
        this.commande.etat = 'N';
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
