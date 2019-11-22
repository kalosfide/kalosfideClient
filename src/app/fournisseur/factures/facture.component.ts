import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Site } from '../../modeles/site';
import { FactureService } from './facture.service';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { SiteService } from 'src/app/modeles/site.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { RouteurService } from 'src/app/services/routeur.service';
import { FactureUtile } from './facture-utile';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ModeAction } from 'src/app/commandes/condition-action';
import { BootstrapType } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';

@Component({
    templateUrl: '../../disposition/page-titre/page-titre.html',
    styleUrls: ['../../commun/commun.scss']
})
/** page titre */
export class FactureComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FournisseurPages.factures;
    pageDef: PageDef = FournisseurPages.factures;

    site: Site;
    barre: BarreTitre;

    constructor(
        protected route: ActivatedRoute,
        protected _service: FactureService,
        protected _siteService: SiteService,
    ) {
        super();
    }

    get service(): FactureService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): FactureUtile { return this._service.utile; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        barre.ajoute(Fabrique.barreTitre.groupeAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette, '');

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

    private rafraichit() {
        this.barre.site = this._service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this._siteService.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            () => {
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.rafraichit();
            }
        ));
    }

}
