import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { ActivatedRoute, Data } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureService } from './facture.service';
import { Client } from 'src/app/modeles/client/client';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { FactureUtile } from './facture-utile';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from 'src/app/modeles/site/site.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Facture } from './facture';
import { FactureProduit } from './facture-produit';
import { FactureStock } from './facture-stock';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { ModeAction } from 'src/app/commandes/condition-action';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { BootstrapNom } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';

class EnTêteFacture {
    nom: string;
    titre: string;
    texteDef: () => string;
}

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureProduitsComponent extends PageTableComponent<FactureProduit> implements OnInit, OnDestroy {

    static _pageDef: PageDef = FacturePages.facture;
    pageDef: PageDef = FacturePages.facture;

    site: Site;
    identifiant: Identifiant;

    client: Client;

    barre: BarreTitre;

    date: Date;

    facture: Facture;

    noFacture: number;

    entêtes: EnTêteFacture[];
    vueTableEnTêtes: KfVueTable<EnTêteFacture>;

    constructor(
        protected route: ActivatedRoute,
        protected _service: FactureService,
        protected _siteService: SiteService,
    ) {
        super(route, _service);
    }

    get service(): FactureService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): FactureUtile { return this.service.utile; }

    get titre(): string {
        return this.pageDef.titre;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;

        return barre;
    }

    private créeGroupeEntête(): KfGroupe {
        const groupe = new KfGroupe('entete');
        this.entêtes = [
            {
                nom: 'facture',
                titre: 'Facture',
                texteDef: () => '' + this.noFacture
            },
            {
                nom: 'client',
                titre: 'Client',
                texteDef: () => this.client.nom
            },
            {
                nom: 'commandes',
                titre: 'Commandes',
                texteDef: () => {
                    const commandes = this.facture.commandes.map(c => c.texteBonDeCommande);
                    return commandes.join(', ');
                }
            }
        ];
        const colonnesDef: IKfVueTableColonneDef<EnTêteFacture>[] = [{
            nom: 'titre',
            créeContenu: (enTête: EnTêteFacture) => enTête.titre,
        }, {
            nom: 'texte',
            créeContenu: (enTête: EnTêteFacture) => ({ texteDef: enTête.texteDef })
        }];
        const vueTableDef: IKfVueTableDef<EnTêteFacture> = {
            colonnesDef: colonnesDef,
            avecEnTêtesDeLigne: true,
        };
        this.vueTableEnTêtes = Fabrique.vueTable.vueTable('enTetes', vueTableDef);
        this.vueTableEnTêtes.initialise(this.entêtes);
        groupe.ajoute(this.vueTableEnTêtes);
        return groupe;
    }

    créeBoutonEnregistrer(client: IKeyUidRno, superGroupe: KfSuperGroupe): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.facture(client);
            },
            actionSiOk: (): void => {
                this.service.factureOk(client);
                this.service.routeur.navigueUrlDef(this.service.utile.url.factures());
            },
        };
        const bouton = Fabrique.bouton.boutonAction('enregistrer', 'Enregistrer', apiRequêteAction, this.service);
        return bouton;
    }

    créeBoutonAnnulerTerminer(): KfBouton {
        const def: IBoutonDef = {
            nom: 'annuler',
            contenu: { texte: 'Annuler' },
            bootstrapType: BootstrapNom.dark,
            action: () => {
                this.service.routeur.navigueUrlDef(this.service.utile.url.facture(this.client));
            }
        };
        const bouton = Fabrique.bouton.bouton(def);
        return bouton;
    }

    private créeGroupeEnvoi(superGroupe: KfSuperGroupe): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Les quantités facturées ne pourront plus être modifiées.');
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Cette action ne pourra pas être annulée.');

        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.créeBoutons([this.créeBoutonAnnulerTerminer(), this.créeBoutonEnregistrer(this.client, superGroupe)]);
        groupe.alerte('warning');
        return groupe.groupe;
    }

    créeGroupeTableDef(): IGroupeTableDef<FactureProduit> {

        const vueTableDef: IKfVueTableDef<FactureProduit> = {
            colonnesDef: this.utile.colonne.factureProduit(this.facture),
        };
        return {
            vueTableDef: vueTableDef,
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('produits');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<FactureProduit>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        const stock: FactureStock = data.stock;
        this.client = data.client;
        const apiFacture = stock.factures.find(f => f.uid === this.client.uid && f.rno === this.client.rno);
        this.facture = new Facture(apiFacture, this.client, stock.catalogue);
        this.facture.créeFactureProduits(apiFacture, stock.catalogue);
        this.noFacture = stock.noProchaineFacture;
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.envoi);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.superGroupe.ajoute(this.créeGroupeEntête());
        this.ajouteGroupeDétails();
        this.superGroupe.ajoute(this.créeGroupeEnvoi(this.superGroupe));

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.facture.produits);
        this.rafraichit();
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
