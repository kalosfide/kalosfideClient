import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Commande } from 'src/app/commandes/commande';
import { ICommandeStock } from './i-commande-stock';
import { CommandeService } from './commande.service';
import { Client } from '../modeles/client/client';
import { ICommandeComponent } from './i-commande-component';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { ApiRequêteAction } from '../services/api-requete-action';
import { CommandeAvecDetailComponent } from './commande-avec-details.component';
import { Produit } from '../modeles/catalogue/produit';
import { ApiCommande } from './api-commande';
import { EtatTableType } from '../disposition/page-table/etat-table';
import { IGroupeTableDef, GroupeTable } from '../disposition/page-table/groupe-table';
import { ModeAction } from './condition-action';
import { IBoutonDef } from '../disposition/fabrique/fabrique-bouton';
import { BootstrapNom, FabriqueBootstrap } from '../disposition/fabrique/fabrique-bootstrap';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { ModeTable } from '../commun/data-par-key/condition-table';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeContenuPhrasé } from '../commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { GroupeBoutonsMessages } from '../disposition/fabrique/fabrique-formulaire';

export abstract class CommandeComponent extends CommandeAvecDetailComponent implements OnInit, OnDestroy, ICommandeComponent {

    commandeStock: ICommandeStock;

    grActionImpossible: KfGroupe;
    etActionImpossible: KfEtiquette;

    grEtatDernièreCommande: KfGroupe;
    etEtatDernièreCommande: KfEtiquette;

    grDétails: KfGroupe;
    etTitreDétails: KfEtiquette;
    grCréer: GroupeBoutonsMessages;
    etCopier: KfEtiquette;
    btCopier: KfBouton;
    grCatalogueChangé: KfGroupe;
    grSupprime: GroupeBoutonsMessages;
    etSupprime: KfEtiquette;
    btSupprime: KfBouton;

    modeTableInitial: ModeTable;

    doitRecharger: boolean;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommandeService,
    ) {
        super(route, _service);
    }

    get keyClient(): IKeyUidRno {
        return this.client ? this.client : this.identifiant.keyClient(this.site);
    }

    private apiRequêteActionCréeVide(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this._service.créeVide(this.keyClient);
            },
            actionSiOk: (): void => {
                this._service.siCréeVideOk(this.keyClient);
                const stock = this._service.litStock();
                this.charge(stock);
                this._service.changeMode(ModeAction.edite);
            },
        };
        if (this._service.redirigeSiErreur400) {
            apiRequêteAction.traiteErreur400 = this._service.redirigeSiErreur400;
        }
        if (this._service.actionSiErreur) {
            apiRequêteAction.actionSiErreur = () => {
                this._service.actionSiErreur(this.superGroupe);
            };
        }
        return apiRequêteAction;
    }

    private apiRequêteActionCréeCopie(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this._service.créeCopie(this.keyClient);
            },
            actionSiOk: (): void => {
                this._service.siCréeCopieOk(this.keyClient);
                this.charge(this._service.litStock());
                this._service.changeMode(ModeAction.edite);
            },
        };
        if (this._service.redirigeSiErreur400) {
            apiRequêteAction.traiteErreur400 = this._service.redirigeSiErreur400;
        }
        if (this._service.actionSiErreur) {
            apiRequêteAction.actionSiErreur = () => {
                this._service.actionSiErreur(this.superGroupe);
            };
        }
        return apiRequêteAction;
    }

    private apiRequêteActionSupprime(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this._service.supprimeOuRefuse$(this._commande);
            },
            actionSiOk: (): void => {
                const estLeClient = !this.client;
                this._service.siSupprimeOuRefuseOk(this._commande, estLeClient);
                const url = this.client
                    ? this._utile.url.desClients()
                    : this._utile.lien.url.commande();
                this.routeur.navigueUrlDef(url);

            },
        };
        if (this._service.redirigeSiErreur400) {
            apiRequêteAction.traiteErreur400 = this._service.redirigeSiErreur400;
        }
        if (this._service.actionSiErreur) {
            apiRequêteAction.actionSiErreur = () => {
                this._service.actionSiErreur(this.superGroupe);
            };
        }
        return apiRequêteAction;
    }

    protected abstract créeColonneDefs(): IKfVueTableColonneDef<DetailCommande>[];

    /** vueTable des détails */
    créeGroupeTableDef(): IGroupeTableDef<DetailCommande> {
        const outils = Fabrique.vueTable.outils<DetailCommande>(this.nom);
        outils.ajoute(this._utile.outils.catégorie());
        outils.ajoute(this._utile.outils.produit());
        const outilAjoute = Fabrique.vueTable.outilAjoute(this._utile.lien.ajoute());
        outilAjoute.bbtnGroup.afficherSi(this._utile.conditionTable.edition);
        outils.ajoute(outilAjoute);
        outils.nePasAfficherSi(this._utile.conditionTable.bilan);

        const vueTableDef: IKfVueTableDef<DetailCommande> = {
            colonnesDef: this.créeColonneDefs(),
            outils: outils,
            superGroupe: (ligne: DetailCommande) => {
                if (!ligne.editeur) {
                    ligne.créeEditeur(this);
                    ligne.editeur.créeSuperGroupe();
                    const apiRequêteAction: ApiRequêteAction = {
                        formulaire: this.superGroupe,
                        demandeApi: (): Observable<ApiResult> => {
                            return this.service.editeDétail(ligne);
                        },
                        actionSiOk: (): void => {
                            this.service.siEditeDétailOk(ligne);
                        },
                    };
                    if (this.service.redirigeSiErreur400) {
                        apiRequêteAction.traiteErreur400 = this.service.redirigeSiErreur400;
                    }
                    if (this.service.actionSiErreur) {
                        apiRequêteAction.actionSiErreur = () => {
                            this.service.actionSiErreur(this.superGroupe);
                        };
                    }
                    [ligne.editeur.kfDemande, ligne.editeur.kfALivrer, ligne.editeur.kfAFacturer].forEach(kf => {
                        if (kf) {
                            Fabrique.input.prépareSuitValeurEtFocus(kf, apiRequêteAction, this.service);
                        }
                    });
                            }
                return ligne.editeur.superGroupe;
            },
            id: (t: DetailCommande) => {
                return this._utile.url.id('' + t.produit.no);
            },
        };

        return {
            vueTableDef: vueTableDef,
            typeEtat: EtatTableType.remplaceTableSiVide
        };
    }

    private ajouteGroupeEtatDernièreCommande() {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-success');
        let etiquette = new KfEtiquette('');
        etiquette = new KfEtiquette('');
        groupe.ajoute(etiquette);
        this.etEtatDernièreCommande = etiquette;
        this.grEtatDernièreCommande = groupe;
        this.superGroupe.ajoute(groupe);
    }

    private rafraichitEtatDernièreCommande() {
        if (!this._commande.préparé) {
            if (!this.client) {
                this.etEtatDernièreCommande.fixeTexte(`La commande numéro ${this._commande.no} est en cours de préparation.`);
            }
        } else {
            const contenus: KfTypeContenuPhrasé[] = [];
            let texte: KfTexte;
            texte = new KfTexte('', `La commande n° ${this._commande.no} du ${Fabrique.texte.date(this._commande.date)}  a été `);
            contenus.push(texte);
            if (this._commande.refusée) {
                texte = new KfTexte('', 'refusée');
                texte.ajouteClasseDef('text-danger');
            } else {
                texte = new KfTexte('', 'traitée');
            }
            contenus.push(texte);
            texte = new KfTexte('', `dans la livraison n° ${this._commande.livraisonNo}. `);
            contenus.push(texte);
            this.etEtatDernièreCommande.contenuPhrase.contenus = contenus;
        }
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('details');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<DetailCommande>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.groupeTable.etat.groupe.nePasAfficherSi(this._utile.conditionTable.aperçu);
        this.grDétails = groupe;
        this.superGroupe.ajoute(groupe);
    }

    protected ajouteBoutonRafraichit(groupe: KfGroupe) {
    }

    private ajouteGroupeActionImpossible() {
        const groupe = new KfGroupe('actionImpossible');
        let etiquette: KfEtiquette;
        groupe.ajouteClasseDef('alert alert-warning');
        etiquette = new KfEtiquette('', 'Vous ne pouvez pas commander actuellement.');
        groupe.ajoute(etiquette);

        this.ajouteBoutonRafraichit(groupe);

        this.etActionImpossible = etiquette;
        this.grActionImpossible = groupe;
        this.superGroupe.ajoute(groupe);
    }

    private rafraichitActionImpossible() {
        const cause: string = !this.client
            ? this._utile.conditionSite.catalogue.valeur
                ? 'Le site est fermé pendant la mise à jour du catalogue.'
                : undefined
            : this._utile.conditionSite.catalogue.valeur
                ? 'Une modification du catalogue est en cours.'
                : undefined;
        if (cause !== undefined) {
            const conséquence = !this.client
                ? 'Vous ne pouvez pas commander actuellement.'
                : 'Vous ne pouvez pas modifier la commande.';
            this.etActionImpossible.fixeTexte(`${cause} ${conséquence}`);
            this.grActionImpossible.nePasAfficher = false;
        } else {
            this.grActionImpossible.nePasAfficher = true;
        }
    }

    private ajouteGroupeCatalogueChangé() {
        const groupe = new KfGroupe('catalogueChangé');
        groupe.ajouteClasseDef('alert alert-warning');
        let etiquette = new KfEtiquette('',
            `Le catalogue a changé depuis le traitement de ce bon`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        etiquette = new KfEtiquette('',
            `Les détails ci-dessus peuvent différer de l'original si des produits sont devenus indisponibles ou si des prix ont changé.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        etiquette = new KfEtiquette('',
            `Si vous créez un nouveau bon par une copie, vérifiez le résultat avant de l'envoyer.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.grCatalogueChangé = groupe;
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeCréer() {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;
        etiquette = new KfEtiquette('',
            `Il n'a pas de bon de commande ouvert.`);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.push(etiquette);
        etiquette = new KfEtiquette('etCopier',
            'Pour créer un nouveau bon de commande vous pouvez copier le précédent.');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.push(etiquette);
        this.etCopier = etiquette;

        const boutons: (KfBouton | KfLien)[] = [];
        if (this.client) {
            boutons.push(Fabrique.lien.boutonAnnuler(this._utile.url.desClients()));
        }
        boutons.push(Fabrique.bouton.boutonAction('vide', 'Créer un bon vide', this.apiRequêteActionCréeVide(), this._service));
        this.btCopier = Fabrique.bouton.boutonAction('copier', 'Copier le bon précédent',
            this.apiRequêteActionCréeCopie(), this._service);
        boutons.push(this.btCopier);
        const groupe = new GroupeBoutonsMessages('creer', messages);
        groupe.créeBoutons(boutons);
        groupe.alerte('primary');
        groupe.groupe.afficherSi(this._utile.conditionAction.doitCréer);
        this.grCréer = groupe;
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeSupprime() {
        const messages: KfComposant[] = [];
        this.etSupprime = Fabrique.ajouteEtiquetteP(messages, 'text-center');
        Fabrique.ajouteEtiquetteP(messages, 'text-center').fixeTexte('Cette action ne pourra pas être annulée.');
        const def: IBoutonDef = {
            nom: '',
            contenu: { texte: 'Annuler' },
            bootstrapType: BootstrapNom.dark,
            action: !this.client
                ? () => {
                    this.service.changeMode(ModeAction.edite);
                }
                : () => {
                    this.service.changeMode(ModeAction.edite);
                    this.service.routeur.navigueUrlDef(this._utile.url.retourDUnClient(this._commande));
                }
        };
        const boutonAnnuler = Fabrique.bouton.bouton(def);
        this.btSupprime = Fabrique.bouton.boutonAction('supprime', '', this.apiRequêteActionSupprime(), this._service);
        const groupe = new GroupeBoutonsMessages('supprime', messages);
        groupe.créeBoutons([boutonAnnuler, this.btSupprime]);
        groupe.alerte('warning');
        this.grSupprime = groupe;
        this.superGroupe.ajoute(groupe.groupe);
    }
    private rafraichitSupprime() {
        if (!this.client) {
            // l'utilisateur est le client
            this.etSupprime.fixeTexte(`Toutes les lignes de la commande vont être effacées.`);
            this.btSupprime.fixeTexte('Effacer la commande');
        } else {
            // l'utilisateur est le fournisseur
            if (this._commande.crééeParLeClient) {
                this.etSupprime.fixeTexte(`La commande de ${this.client.nom} va être refusée et exclue de la livraison.`);
                this.btSupprime.fixeTexte('Refuser la commande');
            } else {
                this.etSupprime.fixeTexte(`La commande de ${this.client.nom} va être supprimée.`);
                this.btSupprime.fixeTexte('Supprimer la commande');
            }
        }
    }

    // change quand on crée
    get commandeExiste() {
        return !!this._commande;
    }

    // change quand on crée
    get commandeNExistePas() {
        return !this._commande;
    }

    get commandeOuverteQuandExiste(): boolean {
        if (!this.client) {
            // l'utilisateur est le client
            return this._commande.ouverte;
        } else {
            // l'utilisateur est le fournisseur
            return !this._commande.préparé;
        }
    }

    // Ne peut pas changer sans quitter la page
    private get peutAgir(): boolean {
        if (!this.client) {
            // l'utilisateur est le client
            return this.site.etat === IdEtatSite.ouvert;
        } else {
            // l'utilisateur est le fournisseur
            return this.site.etat === IdEtatSite.ouvert && !this.client.avecCompte;
        }
    }

    get doitCréer(): boolean {
        return this.peutAgir && (this.commandeNExistePas || !this.commandeOuverteQuandExiste);
    }

    get commandeCopiable(): boolean {
        return this.commandeExiste && !this._commande.refusée && this._commande.détails.length > 0;
    }

    protected rafraichit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.rafraichitActionImpossible();
        const mode = this.service.modeAction;

        this.grDétails.visible = this.commandeExiste;

        if (this.commandeExiste && (mode === ModeAction.doitCréer || (mode === ModeAction.aperçu && !this.client))) {
            this.rafraichitEtatDernièreCommande();
            this.grEtatDernièreCommande.nePasAfficher = false;
        } else {
            this.grEtatDernièreCommande.nePasAfficher = true;
        }

        if (mode === ModeAction.doitCréer) {
            this.grCréer.groupe.nePasAfficher = false;
            if (this.commandeCopiable) {
                this.etCopier.visible = true;
                this.btCopier.visible = true;
                const dateCatalogue = new Date(this.commandeStock.catalogue.date);
                const date = new Date(this._commande.date);
                this.grCatalogueChangé.nePasAfficher = dateCatalogue <= date;
            } else {
                this.etCopier.visible = false;
                this.btCopier.visible = false;
                this.grCatalogueChangé.nePasAfficher = true;
            }
        } else {
            this.grCréer.groupe.nePasAfficher = true;
            this.grCatalogueChangé.nePasAfficher = true;
        }


        if (mode === ModeAction.supprime) {
            this.rafraichitSupprime();
            this.grSupprime.groupe.visible = true;
        } else {
            this.grSupprime.groupe.visible = false;
        }

    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        this.ajouteGroupeActionImpossible();
        this.ajouteGroupeEtatDernièreCommande();
        this.ajouteGroupeDétails();
        this.ajouteGroupeCatalogueChangé();
        this.ajouteGroupeCréer();
        this.ajouteGroupeSupprime();

        this.superGroupe.quandTousAjoutés();
    }

    abstract créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande;

    créeDétails(produits: Produit[]): DetailCommande[] {
        const détails: DetailCommande[] = [];
        this._commande.apiCommande.details.forEach(d => {
            const produit = produits.find(p => p.no === d.no);
                détails.push(this.créeUnDétail(this._commande.apiCommande, produit, this.client));
        });
        return détails;
    }

    chargeStock(stock: ICommandeStock) {
        this.commandeStock = stock;
        const apiCommande = this._service.commandeStockée(this.commandeStock, this.client);
        if (apiCommande) {
            this._commande = new Commande(apiCommande, this.client);
            const produits = this.commandeStock.catalogue.produits;
            this._commande.détails = this.créeDétails(produits);
        } else {
            this._commande = undefined;
        }
    }

    charge(stock: ICommandeStock) {
        this.chargeStock(stock);
        this.chargeGroupe();
    }

    avantChargeData() {
        this.site = this._service.navigation.litSiteEnCours();
        this.identifiant = this._service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this.client = data.client;
        this.chargeStock(data.stock);
    }

    protected get modeActionInitial(): ModeAction {
        const enCours = this.service.modeAction;
        if (enCours === ModeAction.edite) {
            if (this.doitCréer) {
                return ModeAction.doitCréer;
            }
        } else {
            if (enCours === ModeAction.doitCréer) {
                if (!this.doitCréer) {
                    return ModeAction.edite;
                }
            }
        }
        return enCours;
    }

    initialiseUtile() {
        this.service.initialiseModeAction(this.modeActionInitial);
        if (this.modeTableInitial) {
            this.service.changeModeTable(this.modeTableInitial);
        }
        this.service.utile.url.initialiseRouteDétail({ client: this.client });
    }

    protected chargeGroupe() {
        this.groupeTable.etat.initialise('Il n\'a pas de lignes de commande.', this._utile.lien.defAjoute(), 'warning');
        this._utile.outils.chargeCatégories(this.vueTable, this.commandeStock.catalogue.catégories);
        if (this._commande) {
            this._chargeVueTable(this._commande.détails);
        }
        this.rafraichit();
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => this.rafraichit())
        );
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            initialiseUtile: () => this.initialiseUtile(),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
