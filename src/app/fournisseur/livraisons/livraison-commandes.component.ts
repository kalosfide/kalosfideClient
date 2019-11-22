import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { LivraisonPages } from './livraison-pages';
import { LivraisonService } from './livraison.service';
import { Client } from 'src/app/modeles/clientele/client';
import { LivraisonCommandes } from './livraison-commandes';
import { Commande } from 'src/app/commandes/commande';
import { LivraisonStock } from './livraison-stock';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { ILivraisonComponent } from './i-livraison-component';
import { LivraisonUtile } from './livraison-utile';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from 'src/app/modeles/site.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTableType } from 'src/app/disposition/page-table/etat-table';
import { ModeAction } from 'src/app/commandes/condition-action';
import { texteKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { concatMap, map } from 'rxjs/operators';
import { ClientService } from 'src/app/modeles/clientele/client.service';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonCommandesComponent extends PageTableComponent<Commande> implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = LivraisonPages.commandes;
    pageDef: PageDef = LivraisonPages.commandes;

    private _lienProduits: KfLien;
    get lienProduits(): KfLien {
        if (!this._lienProduits) {
            this._lienProduits = this.utile.lien.desProduits();
        }
        return this._lienProduits;
    }

    get livraisonNo(): number { return this.livraisonCommandes.stock.apiLivraison.no; }

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    date: Date;
    // {[dataCatalogue, {2019-08-13T08:55:39.1666032}]} "2019-08-13T08:55:39.1666032"
    livraisonCommandes: LivraisonCommandes;
    termine: boolean;

    grEnvoyer: KfGroupe;
    grEnvoi: KfGroupe;
    etEnvoi: KfEtiquette;
    btEnvoi: KfBouton;
    grEnvoyé: KfGroupe;
    envoyé: KfInitialObservable<boolean>;

    casePeutEnvoyer: KfCaseACocher;

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected _siteService: SiteService,
        private _clientService: ClientService,
    ) {
        super(route, _service);
    }

    get service(): LivraisonService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): LivraisonUtile { return this.service.utile; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });
        let groupe = Fabrique.barreTitre.groupe('rafraichit');
        const rafraichit = Fabrique.barreTitre.boutonRafraichit('rafraichit');
        Fabrique.bouton.fixeActionBouton(rafraichit, () => this.recharge());
        groupe.ajoute(rafraichit);
        groupe.nePasAfficherSi(this.utile.conditionSite.livraison);
        barre.ajoute({
            groupe: groupe,
            rafraichit: () => {
                const texte = Fabrique.texte.Initale(Fabrique.texte.àXHeure(this.date));
                const contenu: IContenuPhraseDef = {
                    nomIcone: Fabrique.icone.nomIcone.rafraichit,
                    couleurIcone: Couleur.blue,
                    texte: texte,
                    positionTexte: 'gauche',
                };
                Fabrique.contenu.fixeDef(rafraichit, contenu);
            }
        });
        groupe = Fabrique.barreTitre.groupe('produits');
        const lien = this.utile.lien.desProduits();
        const estVide: () => boolean = (() => {
            return !this.groupeTable || this.vueTable.estVide;
        }).bind(this);
        lien.inactivitéFnc = estVide;
        groupe.ajoute(lien);
        barre.ajoute({ groupe: groupe });

        this.barre = barre;

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<Commande> {
        const outils = Fabrique.vueTable.outils<Commande>(this.nom);
        outils.ajoute(this.utile.outils.clientDeCommandes());
        const outilAjoute = Fabrique.vueTable.outilAjoute(this.utile.lien.ajouteCommande());
        outilAjoute.bbtnGroup.afficherSi(this.utile.conditionTable.edition);
        outils.ajoute(outilAjoute);
        outils.nePasAfficherSi(this.utile.conditionTable.bilan);

        const vueTableDef: IKfVueTableDef<Commande> = {
            colonnesDef: this.utile.colonne.commande.defsCommandes(),
            outils: outils,
            id: (t: Commande) => {
                return this.utile.url.id(texteKeyUidRno(t));
            },
        };
        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('commandes');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<Commande>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        if (this._service.modeAction === ModeAction.envoi) {
            this.vueTable.outils.supprimeFiltres();
        }
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        const stock: LivraisonStock = data.stock;
        const clients: Client[] = data.clients;
        this.termine = data.termine;
        this.livraisonCommandes = new LivraisonCommandes(stock, clients);
        this.date = new Date(Date.now());
    }

    protected get modeActionInitial(): ModeAction {
        const enCours = this.service.modeAction;
        if (enCours === ModeAction.supprime) {
            return ModeAction.edite;
        }
        if (enCours === ModeAction.doitCréer) {
            return ModeAction.edite;
        }
        return enCours;
    }

    initialiseUtile() {
        this.service.initialiseModeAction(this.modeActionInitial);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.superGroupe.ajoute(this.utile.groupeCatalogue());
        this.ajouteGroupeDétails();
        this.grEnvoi = this.utile.groupeEnvoi(this.superGroupe, this.service.bilanLivraisonIO);
        this.superGroupe.ajoute(this.grEnvoi);

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.livraisonCommandes.commandes);
        this.groupeTable.etat.initialise('Il n\'a pas de commandes. Vous pouvez ', this.utile.lien.defAjouteCommande(), 'warning');
        this.rafraichit();
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => {
                this.rafraichit();
            })
        );
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }

    recharge() {
        const subscription = this.service.rechargeStock().pipe(
            concatMap((stock: LivraisonStock) => {
                return this._clientService.rechargeClients().pipe(
                    map((clients: Client[]) => {
                        const data = {
                            stock: stock,
                            clients: clients
                        };
                        return data;
                    })
                );
            })
        ).subscribe(data => {
            subscription.unsubscribe();
            this.livraisonCommandes = new LivraisonCommandes(data.stock, data.clients);
            this.date = new Date(Date.now());
            this._chargeVueTable(this.livraisonCommandes.commandes);
            this.rafraichit();
        });
    }
}
