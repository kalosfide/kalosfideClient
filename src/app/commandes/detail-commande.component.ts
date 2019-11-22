import { OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { Site } from '../modeles/site';
import { Identifiant } from '../securite/identifiant';
import { Observable } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { DetailCommande } from './detail-commande';
import { CommandeService } from './commande.service';
import { ICommandeComponent } from './i-commande-component';
import { Client } from '../modeles/clientele/client';
import { CommandeUtile } from './commande-utile';
import { IKeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { ApiRequêteAction } from '../services/api-requete-action';
import { AfficheResultat } from '../disposition/affiche-resultat/affiche-resultat';
import { RouteurService } from '../services/routeur.service';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { FabriqueBootstrap } from '../disposition/fabrique/fabrique-bootstrap';
import { GroupeBoutonsMessages } from '../disposition/fabrique/fabrique-formulaire';

export abstract class DetailCommandeComponent extends PageBaseComponent implements OnInit, OnDestroy, AfterViewInit, ICommandeComponent {

    site: Site;
    identifiant: Identifiant;

    protected _détail: DetailCommande;

    private _afficheRésultat: AfficheResultat;

    /** si présent et vrai, c'est la page .../commande/supprime */
    suppression?: boolean;
    ajout: boolean;

    get utile(): CommandeUtile {
        return this._service.utile;
    }

    get détail(): DetailCommande { return this._détail; }
    get produit(): Produit { return this._détail.produit; }
    get client(): Client { return this._détail.client; }
    get ikeyCommande(): IKeyUidRnoNo { return this._détail.apiCommande; }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommandeService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super();
    }

    get service(): CommandeService { return this._service; }
    get routeur(): RouteurService { return this.service.routeur; }

    abstract créeDétail(data: Data): DetailCommande;

    private apiRequêteActionEdite(afficheResultat: AfficheResultat): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.editeDétail(this._détail, this.ajout);
            },
            actionSiOk: (): void => {
                this.service.siEditeDétailOk(this._détail, this.ajout);
                this.routeur.navigueUrlDef(this.utile.lien.url.commande());
            },
            afficheResultat: afficheResultat,
        };
        if (this.service.redirigeSiErreur400) {
            apiRequêteAction.traiteErreur400 = this.service.redirigeSiErreur400;
        }
        if (this.service.actionSiErreur) {
            apiRequêteAction.actionSiErreur = () => {
                this.service.actionSiErreur(this.superGroupe);
            };
        }
        return apiRequêteAction;
    }

    private apiRequêteActionSupprime(afficheResultat: AfficheResultat): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.supprimeDétail(this._détail);
            },
            actionSiOk: (): void => {
                this.service.siSupprimeDétailOk(this._détail);
                this.routeur.navigueUrlDef(this.utile.lien.url.commande());
            },
            afficheResultat: afficheResultat,
        };
        if (this.service.redirigeSiErreur400) {
            apiRequêteAction.traiteErreur400 = this.service.redirigeSiErreur400;
        }
        if (this.service.actionSiErreur) {
            apiRequêteAction.actionSiErreur = () => {
                this.service.actionSiErreur(this.superGroupe);
            };
        }
        return apiRequêteAction;
    }

    private créeGroupeSupprime(afficheResultat: AfficheResultat): KfGroupe {
        const groupe = new KfGroupe('');
        const etiquettes: KfComposant[] = [];
        Fabrique.ajouteEtiquetteP(etiquettes, 'text-center');
        Fabrique.ajouteEtiquetteP(etiquettes, 'text-center');
        etiquettes.forEach(e => groupe.ajoute(e));

        const apiRequêteAction = this.apiRequêteActionSupprime(afficheResultat);
        const boutonAnnuler = Fabrique.lien.boutonAnnuler(this.utile.url.retourDétail(this._détail));
        const btSupprime = Fabrique.bouton.boutonAction('supprime', 'Supprimer', apiRequêteAction, this.service);
        const btn_msg = new GroupeBoutonsMessages('supprimme');
        btn_msg.créeBoutons([boutonAnnuler, btSupprime]);
        groupe.ajoute(btn_msg.groupe);

        let peutSupprimer: boolean;
        let texteDemande: string;
        if (!this.client) {
            // l'utilisateur est le client
            peutSupprimer = true;
            texteDemande = this.produit.nom;
        } else {
            // l'utilisateur est le fournisseur
            peutSupprimer = !this._détail.crééParLeClient;
            texteDemande = this.produit.nom + ' par ' + this.client.nom;
        }

        if (peutSupprimer) {
            FabriqueBootstrap.ajouteClasse(groupe, 'alert', 'danger');
            etiquettes[0].fixeTexte(`La demande de ${texteDemande} va être supprimée.`);
            etiquettes[1].fixeTexte('Cette action ne pourra pas être annulée.');
            btSupprime.fixeTexte('Supprimer');
        } else {
            FabriqueBootstrap.ajouteClasse(groupe, 'alert', 'warning');
            groupe.ajouteClasseDef('alert alert-primary');
            etiquettes[0].fixeTexte(`La demande de ${texteDemande} va être refusée et exclue de la livraison.`);
            etiquettes[1].fixeTexte('Vous pourrez annuler cette action en fixant à nouveau la quantité à livrer.');
            btSupprime.fixeTexte('Refuser');
        }

        return groupe;
    }

    private créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;
        this.superGroupe.neSoumetPasSiPristine = true;
        this.superGroupe.avecInvalidFeedback = true;

        const edition = this._détail.créeEdition(this.suppression ? '-' : this.ajout ? '+' : undefined);
        this.superGroupe.ajoute(edition);

        this._afficheRésultat = Fabrique.formulaire.ajouteResultat(edition);

        if (this.suppression) {
            this.superGroupe.ajoute(this.créeGroupeSupprime(this._afficheRésultat));
        } else {
            const apiRequêteAction = this.apiRequêteActionEdite(this._afficheRésultat);
            const boutonAnnuler = Fabrique.lien.boutonAnnuler(this.utile.url.retourDétail(this._détail));
            const boutonEdite = Fabrique.bouton.boutonAction('edite',
                this.ajout ? 'Ajouter' : 'Mettre à jour', apiRequêteAction, this.service);
            boutonEdite.inactivitéFnc = () => {
                return !this.superGroupe.peutSoumettre();
            };
            const btn_msg = new GroupeBoutonsMessages('edite');
            btn_msg.créeBoutons([boutonAnnuler, boutonEdite]);
            this.superGroupe.ajoute(btn_msg.groupe);
            this.superGroupe.ajoute(this._afficheRésultat.groupe);

        }
        this.superGroupe.avecInvalidFeedback = true;
        this.superGroupe.quandTousAjoutés();
    }

    protected initialiseUtile() {
        this.service.utile.url.initialiseRouteDétail({ client: this.client });
    }

    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();

        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this._détail = this.créeDétail(data);
                this.initialiseUtile();
                this.créeTitrePage();
                this.créeSuperGroupe();
            }
        ));
    }

    ngAfterViewInit() {
        this.subscriptions.push(this._afficheRésultat.souscritStatut());
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    peutQuitter = (): boolean | Observable<boolean> | Promise<boolean> => {
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }
}
