import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Data, RouterStateSnapshot } from '@angular/router';

import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { PageDef } from '../../commun/page-def';
import { Site } from '../../modeles/site';
import { CommandePages, CommandeRoutes } from './commande-pages';
import { CommandeService } from './commande.service';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { CommandeLigne, CommeCommandeLigneType, CommeCommandeLigneDemande, CommandeLigneEnTetes } from './commande-ligne';
import { PageTableComponent } from '../../disposition/page-table/page-table.component';
import { Identifiant } from '../../securite/identifiant';
import { CommandeLigneFiltre, TypeCacheProduits } from './commande-ligne-filtre';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ComponentAAutoriserAQuitter } from '../../commun/peut-quitter/peut-quitter-garde.service';
import { Observable } from 'rxjs';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { KfVueTableDef, KfVueCelluleDef, KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfVueTableFiltre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre';
import { IdEtatCommandeLigne, EtatsCommandeLignes } from './etat-commande-ligne';
import { Categorie } from 'src/app/modeles/categorie';

const NOM_TRI_CATEGORIE = 'categorie';
const NOM_TRI_PRODUIT = 'produit';
const NOM_FILTRE_CATEGORIE = 'categorie';
const NOM_FILTRE_DEMANDE = 'demande';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class CommandeProduitsComponent extends PageTableComponent<CommandeLigne> implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    static _pageDef: PageDef = CommandePages.produits;
    pageDef: PageDef = CommandePages.produits;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;
    identifiant: Identifiant;

    vueTableDef: KfVueTableDef<CommandeLigne> = {
        enTetes: CommandeLigneEnTetes,
        cellules: (ligne: CommandeLigne): KfVueCelluleDef[] => ligne.cellulesEditables,
        superGroupe: (ligne: CommandeLigne): KfSuperGroupe => ligne.superGroupe,
        filtres: [
            new KfVueTableFiltre(NOM_FILTRE_CATEGORIE, 'Filtrer par catégorie',
                (cl: CommandeLigne, noCategorie: number) => cl.noCategorie === noCategorie),
            new KfVueTableFiltre(NOM_FILTRE_DEMANDE, 'Filtrer par état',
                (cl: CommandeLigne, idEtat: IdEtatCommandeLigne) => EtatsCommandeLignes.etat(idEtat).vérifie(cl), true)
        ]
    };

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: CommandeService,
        protected attenteAsyncService: AttenteAsyncService,
        private dialogueService: PeutQuitterService
    ) {
        super();
    }

    get urlPageEnvoi(): string {
        return CommandeRoutes.url(this.site.nomSite, CommandePages.envoi.urlSegment);
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (this.liste.filter(cl => cl.demande > 0).length === 0) {
            return true;
        }
        console.log(nextState.url, this.urlPageEnvoi);
        if (!nextState || nextState.url !== this.urlPageEnvoi) {
            return this.dialogueService.confirme(this.pageDef.titre);
        }
        return true;
    }

    get compareProduit(): (cl1: CommandeLigne, cl2: CommandeLigne) => number {
        return (cl1: CommandeLigne, cl2: CommandeLigne): number => {
            return cl1.produit.nom < cl2.produit.nom ? -1 : cl1.produit.nom === cl2.produit.nom ? 0 : 1;
        };
    }

    get compareCategorie(): (cl1: CommandeLigne, cl2: CommandeLigne) => number {
        return (cl1: CommandeLigne, cl2: CommandeLigne): number => {
            return cl1.produit.nomCategorie < cl2.produit.nomCategorie ? -1 : cl1.produit.nomCategorie === cl2.produit.nomCategorie ? 0 : 1;
        };
    }
    traite(evenement: KfEvenement) {
        const typeCommande = CommeCommandeLigneType(evenement.emetteur);
        if (typeCommande) {
            const ligne = typeCommande.ligne;
            ligne.typeCommande = typeCommande.valeur;
            ligne.demandeNombre.rafraichit();
        } else {
            const demande = CommeCommandeLigneDemande(evenement.emetteur);
            if (demande) {
                demande.ligne.demande = demande.valeur;
            }
        }
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.avantTable = () => {
            const groupe = new KfGroupe('');
            groupe.ajouteClasseDef('nav');
            const lien = new KfLien(CommandePages.envoi.urlSegment, this.urlPageEnvoi, CommandePages.envoi.lien);
            lien.ajouteClasseDef('nav-link');
            groupe.ajoute(lien);
            return [
                groupe,
            ];
        };
        this.vueTable = new KfVueTable(this.nom + '_table', this.vueTableDef);
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.liste = data.commande.lignes;
                this.vueTable.initialise(this.liste);
                this.vueTable.chargeFiltre(NOM_FILTRE_CATEGORIE,
                    data.categories.map((c: Categorie) => ({ texte: c.nom, valeur: c.no })), -1);
                this.vueTable.chargeFiltre(NOM_FILTRE_DEMANDE, EtatsCommandeLignes.etats, EtatsCommandeLignes.tous.valeur);
                this.superGroupe = new KfSuperGroupe(this.nom);
                this.superGroupe.créeGereValeur();
                this.prépareSuperGroupe();
                this.superGroupe.quandTousAjoutés();
            }
        ));
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }
}
