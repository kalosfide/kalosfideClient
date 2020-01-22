import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Site } from '../../modeles/site/site';
import { LivraisonService } from './livraison.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { SiteService } from 'src/app/modeles/site/site.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { ILivraisonComponent } from './i-livraison-component';
import { RouteurService } from 'src/app/services/routeur.service';
import { LivraisonUtile } from './livraison-utile';
import { BilanLivraison } from './livraison-etat';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ModeAction } from 'src/app/commandes/condition-action';
import { BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';

interface IActionDef {
    titre: string;
    infos: KfComposant[];
    alerte: BootstrapType;
    defCommencer: IBoutonDef;
    defVérifier: IBoutonDef;
    inactifCommencer: boolean;
    inactifVérifier: boolean;
}

@Component({
    templateUrl: '../../disposition/page-titre/page-titre.html',
    styleUrls: ['../../commun/commun.scss']
})
/** page titre */
export class LivraisonComponent extends PageBaseComponent implements OnInit, OnDestroy, ILivraisonComponent {

    static _pageDef: PageDef = FournisseurPages.livraison;
    pageDef: PageDef = FournisseurPages.livraison;

    site: Site;
    barre: BarreTitre;

    bilan: BilanLivraison;

    actionDef: IActionDef;
    boutonDefs: {
        commencer: IBoutonDef,
        annulerCommencer: IBoutonDef,
        vérifier: IBoutonDef,
        annulerVérifier: IBoutonDef,
    };

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected _siteService: SiteService,
    ) {
        super();
    }

    get service(): LivraisonService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): LivraisonUtile { return this._service.utile; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        this.créeBoutonDefs();

        const info = Fabrique.barreTitre.boutonInfo('');
        const action = Fabrique.barreTitre.boutonAction('action');
        action.fixeStyleDef('width', '85px');
        const vérifier = Fabrique.barreTitre.boutonAction('arret');
        vérifier.fixeStyleDef('width', '85px');
        const groupe = Fabrique.barreTitre.groupe('action');
        groupe.ajoute(info);
        groupe.ajoute(action);
        groupe.ajoute(vérifier);

        const rafraichit = () => {
            const couleur = this.actionDef.alerte === 'danger'
                ? Couleur.red
                : this.actionDef.alerte === 'warning'
                    ? Couleur.warning
                    : Couleur.green;
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
                couleurIcone: couleur,
                texte: this.utile.texte.titre
            });
            Fabrique.barreTitre.fixePopover(info, this.actionDef.titre, this.actionDef.infos);

            Fabrique.bouton.fixeDef(action, this.actionDef.defCommencer);
            action.inactivité = this.actionDef.inactifCommencer;
            Fabrique.bouton.fixeDef(vérifier, this.actionDef.defVérifier);
            vérifier.inactivité = this.actionDef.inactifVérifier;
        };

        barre.ajoute({ groupe: groupe, rafraichit: rafraichit });

        const modeTable = Fabrique.bouton.bouton({
            nom: 'table',
            contenu: { texte: '' }
        });
        modeTable.ajouteClasseDef('btn btn-light');
        const modeAction = new KfEtiquette('action');
        modeAction.ajouteClasseDef('btn btn-light');
        const modes = Fabrique.barreTitre.groupe('modes');
        modes.ajoute(modeTable);
        modes.ajoute(modeAction);

        const rafraichitModes = () => {
            modeTable.fixeTexte('Table: ' + this.service.modeTable);
            Fabrique.bouton.fixeActionBouton(modeTable, () => {
                this.service.changeModeTable(ModeTable.aperçu);
                modeTable.fixeTexte('Table: ' + this.service.modeTable);
            });
            modeAction.fixeTexte('Action: ' + this.service.modeAction);
        };

        barre.ajoute({ groupe: modes, rafraichit: rafraichitModes });

        barre.ajoute(Fabrique.barreTitre.groupeAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette, this.utile.texte.définition_Commander + ' ' + this.utile.texte.définition_Traiter);

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pour les commandes créées par un client, `,
            { t: 'Supprimer', b: KfTypeDeBaliseHTML.b },
            ' est remplacé par ',
            { t: 'Exclure', b: KfTypeDeBaliseHTML.b },
            '.'
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Refuser une commande consiste à fixer à 0 les quantités à livrer des produits demandés.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Quand vous créez une ligne, il n'est pas nécessaire de fixer la quantité demandée.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Dans les pages Produits, les boutons Copier fixent les quantités à livrer en copiant les quantités demandées.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteClasseDef('alert-warning');
        Fabrique.ajouteTexte(etiquette,
            `Attention! un client connecté ne peut pas commander pendant le traitement.`
        );

        return infos;
    }

    private créeBoutonDefCommencer(): IBoutonDef {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.commenceLivraison(this.site);
            },
            actionSiOk: ((): void => {
                this.service.commenceLivraisonOk(this.site);
                this.service.routeur.navigueUrlDef(this.service.utile.url.livraison());
            }).bind(this),
        };
        const def: IBoutonDef = {
            nom: 'action',
            contenu: {
                texte: this.utile.texte.titre_Commencer,
            },
            bootstrapType: 'secondary',
            action: () => this.service.action(apiRequêteAction),
        };
        return def;
    }

    private créeBoutonDefAnnulerCommencer(): IBoutonDef {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.annuleLivraison(this.site);
            },
            actionSiOk: ((): void => {
                this.service.annuleLivraisonOk(this.site);
                this.service.routeur.navigueUrlDef(this.service.utile.url.livraison());
            }).bind(this),
        };
        const def: IBoutonDef = {
            nom: 'action',
            contenu: {
                texte: this.utile.texte.titre_AnnulerCommencer,
            },
            bootstrapType: 'dark',
            action: () => this.service.action(apiRequêteAction),
        };
        return def;
    }

    private créeBoutonDefVérifier(): IBoutonDef {
        const def: IBoutonDef = {
            nom: 'vérifier',
            contenu: {
                texte: this.utile.texte.titre_Vérifier,
            },
            bootstrapType: 'secondary',
            action: () => {
                this.service.changeMode(ModeAction.envoi);
                this.service.routeur.navigueUrlDef(this.service.utile.url.desClients());
            },
        };
        return def;
    }

    private créeBoutonDefAnnulerVérifier(): IBoutonDef {
        const def: IBoutonDef = {
            nom: 'vérifier',
            contenu: {
                texte: this.utile.texte.titre_AnnulerVérifier,
            },
            bootstrapType: 'dark',
            action: () => {
                this.service.changeMode(ModeAction.edite);
                this.service.routeur.navigueUrlDef(this.service.utile.url.desClients());
            },
        };
        return def;
    }

    private créeBoutonDefs() {
        this.boutonDefs = {
            commencer: this.créeBoutonDefCommencer(),
            annulerCommencer: this.créeBoutonDefAnnulerCommencer(),
            vérifier: this.créeBoutonDefVérifier(),
            annulerVérifier: this.créeBoutonDefAnnulerVérifier()
        };
    }

    créeActionDef(): IActionDef {
        let titre: string;
        const infos: KfComposant[] = [];
        let alerte: BootstrapType;
        let defCommencer: IBoutonDef;
        let defVérifier: IBoutonDef;
        let inactifCommencer = false;
        let inactifVérifier = false;

        let etiquette: KfEtiquette;

        switch (this.site.etat) {
            case IdEtatSite.catalogue:
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteClasseDef('alert-danger');
                Fabrique.ajouteTexte(etiquette,
                    `Vous ne pouvez pas `,
                    { t: this.utile.texte.titre_Commencer, b: KfTypeDeBaliseHTML.b },
                    ` pendant que le catalogue est en cours de modification.`
                );
                alerte = 'danger';
                titre = this.utile.texte.titre_Commencer;
                defCommencer = this.boutonDefs.commencer;
                inactifCommencer = true;
                defVérifier = this.boutonDefs.vérifier;
                inactifVérifier = true;
                break;
            /*
            case IdEtatSite.livraison:
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                Fabrique.ajouteTexte(etiquette,
                    `Vous pouvez commander pour vos clients qui n\'ont pas de compte.`
                    + ` Vous pouvez modifier et traiter les commandes.`
                );

                defCommencer = this.boutonDefs.annulerCommencer;
                if (this.bilan.nbDétails > 0) {
                    const àPréparer = this.bilan.nbDétails - this.bilan.nbPréparés;
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    let description: string;
                    if (àPréparer === 0) {
                        description = `Toutes les demandes de produits ont été préparées.`;
                        etiquette.ajouteClasseDef('alert-success');
                        alerte = 'success';
                    } else {
                        description =
                            `Il y a ${àPréparer === 1 ? 'une demande' : '' + àPréparer + ' demandes'} de produits à préparer.`;
                        etiquette.ajouteClasseDef('alert-warning');
                        alerte = 'warning';
                    }
                    Fabrique.ajouteTexte(etiquette, description);
                    if (this.utile.conditionAction.envoi.valeur) {
                        titre = this.utile.texte.titre_AnnulerVérifier;
                        defVérifier = this.boutonDefs.annulerVérifier;
                        inactifCommencer = true;
                    } else {
                        titre = this.utile.texte.titre_Vérifier;
                        defVérifier = this.boutonDefs.vérifier;
                        inactifVérifier = !(this.utile.conditionAction.edite && àPréparer === 0);
                    }
                }
                break;
            */
            case IdEtatSite.ouvert:
                titre = this.utile.texte.titre_Commencer;
                defCommencer = this.créeBoutonDefCommencer();
                defVérifier = this.créeBoutonDefVérifier();
                inactifVérifier = true;
                if (this.service.utile.condition.catalogueOuPasDeClients.valeur) {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    etiquette.ajouteClasseDef('alert-danger');
                    Fabrique.ajouteTexte(etiquette, `Il n'y a pas de clients!`);
                    alerte = 'danger';
                    inactifCommencer = true;
                    inactifVérifier = true;
                } else {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    Fabrique.ajouteTexte(etiquette,
                        ' Vous pouvez commander pour vos clients qui n\'ont pas de compte.'
                        + ' Vous ne pouvez pas traiter les commandes'
                    );

                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    etiquette.ajouteClasseDef('text-danger');
                    Fabrique.ajouteTexte(etiquette, `Attention! `,
                        { t: this.utile.texte.titre_Commencer, b: KfTypeDeBaliseHTML.b },
                        ` arrêtera les commandes: un client connecté ne peut pas commander pendant le traitement.`
                    );
                    break;
                }
        }

        const def: IActionDef = {
            titre: titre,
            infos: infos,
            alerte: alerte,
            defCommencer: defCommencer,
            inactifCommencer: inactifCommencer,
            defVérifier: defVérifier,
            inactifVérifier: inactifVérifier
        };

        return def;
    }

    private rafraichit() {
        this.bilan = this.service.bilanLivraison;
        this.actionDef = this.créeActionDef();
        this.barre.site = this._service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this._siteService.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            () => {
                this.bilan = this._service.bilanLivraison;
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.rafraichit();

                this.subscriptions.push(
                    this.service.modeActionIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.modeTableIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.bilanLivraisonIO.observable.subscribe(
                        (bilan) => {
                            this.bilan = bilan;
                            this.rafraichit();
                        }),
                );
            }
        ));
    }

}
