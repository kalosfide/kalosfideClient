import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';

interface IActionDef {
    infos: KfComposant[];
    alerte: BootstrapType;
    inactif: boolean;
    titre: string;
    action: () => void;
}

@Component({
    templateUrl: '../../disposition/page-titre/page-titre.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CatalogueComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FournisseurPages.produits;
    pageDef: PageDef = FournisseurPages.produits;

    site: Site;
    barre: BarreTitre;

    actionDef: IActionDef;

    private _nbCommandesOuvertes: number;

    constructor(
        protected route: ActivatedRoute,
        protected service: CatalogueService,
    ) {
        super();
    }

    titre_action = 'Modification';
    titre_Commencer = 'Commencer';
    titre_Terminer = 'Arrêter';

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        const info = Fabrique.barreTitre.boutonInfo('', 'Etat');
        const action = Fabrique.barreTitre.boutonAction('action');
        const groupe = Fabrique.barreTitre.groupe('action');
        groupe.ajoute(info);
        groupe.ajoute(action);

        const rafraichit = () => {
            console.log(this.actionDef);
            const couleur = this.actionDef.alerte === 'danger'
                ? Couleur.red
                : this.actionDef.alerte === 'warning'
                    ? Couleur.warning
                    : Couleur.green;
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
                couleurIcone: couleur,
                texte: this.titre_action,
            });
            Fabrique.barreTitre.fixePopover(info, this.actionDef.titre, this.actionDef.infos);
            Fabrique.contenu.fixeDef(action, { texte: this.actionDef.titre });
            Fabrique.bouton.fixeActionBouton(action, this.actionDef.action);
            action.inactivité = this.actionDef.inactif;
        };

        barre.ajoute({ groupe: groupe, rafraichit: rafraichit });

        barre.ajoute(Fabrique.barreTitre.groupeAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pour pouvoir créer et modifier les produits et leurs catégories et fixer les prix, vous devez `,
            { t: this.titre_Commencer, b: KfTypeDeBaliseHTML.b },
            `.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pendant la modification du catalogue, votre site sera fermé: les accès aux pages `,
            { t: 'Catalogue', b: KfTypeDeBaliseHTML.i },
            ` et `,
            { t: 'Commandes', b: KfTypeDeBaliseHTML.i },
            ' redirigeront vos visiteurs et vos clients vers une page ',
            { t: 'Site fermé', b: KfTypeDeBaliseHTML.i },
            `.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Vous devrez `,
            { t: 'Terminer la modification', b: KfTypeDeBaliseHTML.b },
            ` pour rouvrir votre site.`
        );

        return infos;
    }

    get apiRequêteCommencer(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.commenceModification(this.site);
            },
            actionSiOk: (): void => {
                this.service.commenceModificationOk(this.site);
                this.service.routeur.naviguePageDef(FournisseurPages.produits, FournisseurRoutes, this.site.nomSite);
            },
        };
        return apiRequêteAction;
    }

    get apiRequêteTerminer(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.termineModification(this.site);
            },
            actionSiOk: (): void => {
                this.service.termineModificationOk(this.site);
                this.service.routeur.naviguePageDef(FournisseurPages.produits, FournisseurRoutes, this.site.nomSite);
            },
        };
        return apiRequêteAction;
    }

    créeActionDef(): IActionDef {
        const infos: KfComposant[] = [];
        let alerte: BootstrapType;
        let inactif = false;
        let titre: string;
        let apiRequête: ApiRequêteAction;

        let etiquette: KfEtiquette;

        switch (this.site.etat) {
            case IdEtatSite.livraison:
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteClasseDef('alert-danger');
                Fabrique.ajouteTexte(etiquette,
                    `Vous ne pouvez pas `,
                    { t: this.titre_Commencer, b: KfTypeDeBaliseHTML.b },
                    ` pendant le traitement des commandes.`
                );
                alerte = 'danger';
                inactif = true;
                titre = this.titre_Commencer;
                apiRequête = this.apiRequêteCommencer;
                break;
            case IdEtatSite.catalogue:
                if (this.site.nbProduits === 0) {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    Fabrique.ajouteTexte(etiquette,
                        `Vous ne pouvez pas `,
                        { t: 'Terminer la modification', b: KfTypeDeBaliseHTML.b },
                        ` et rouvrir votre site tant qu'il n'y a pas de produits disponibles.`
                    );
                } else {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    etiquette.ajouteClasseDef('alert-warning');
                    Fabrique.ajouteTexte(etiquette, `Attention! un client connecté ne peut pas commander pendant le traitement.`);
                }
                titre = this.titre_Terminer;
                apiRequête = this.apiRequêteTerminer;
                break;
            case IdEtatSite.ouvert:
                if (this._nbCommandesOuvertes > 0) {
                    etiquette = Fabrique.ajouteEtiquetteP(infos);
                    etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
                    etiquette.ajouteClasseDef('text-justify text-danger');
                    Fabrique.ajouteTexte(etiquette,
                        `Vous ne pouvez pas `,
                        { t: this.titre_Commencer, b: KfTypeDeBaliseHTML.b },
                        ` parce qu'il y a ${this._nbCommandesOuvertes > 1 ? this._nbCommandesOuvertes : 'une'} `
                        + `commande${this._nbCommandesOuvertes > 1 ? 's' : ''} en attente de traitement.`
                    );
                    alerte = 'danger';
                    inactif = true;
                }
                titre = this.titre_Commencer;
                apiRequête = this.apiRequêteCommencer;
                break;
        }

        const def: IActionDef = {
            infos: infos,
            alerte: alerte,
            inactif: inactif,
            action: () => {
                this.service.action(apiRequête);
            },
            titre: titre
        };

        return def;
    }

    private rafraichit() {
        this.actionDef = this.créeActionDef();
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.service.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this._nbCommandesOuvertes = data.nbCommandesOuvertes;
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.rafraichit();

                this.subscriptions.push(this.service.navigation.siteObs().subscribe(
                    () => {
                        this.site = this.service.navigation.litSiteEnCours();
                        this.rafraichit();
                    }));
            }
        ));
    }

}
