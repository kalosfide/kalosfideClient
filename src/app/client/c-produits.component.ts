import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../modeles/catalogue/produit-index-base.component';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { ClientPages } from './client-pages';
import { BarreTitre, IBarreDef } from '../disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class CProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = ClientPages.produits;
    pageDef: PageDef = ClientPages.produits;

    get titre(): string {
        return this.pageDef.titre;
    }
    niveauTitre = 0;

    barre: BarreTitre;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre(this.barreTitreDef);
        barre.ajoute(Fabrique.barreTitre.groupeAccès('client'));
        this.barre = barre;
        return barre;
    }

    protected get barreTitreDef(): IBarreDef {
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[]];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
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

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.aprèsChargeData = () => {
            this.barre.site = this._service.navigation.litSiteEnCours();
            this.barre.rafraichit();
        };
    }

}
