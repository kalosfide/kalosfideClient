import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { FournisseurPages } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';

@Component({
    templateUrl: '../../disposition/page-titre/page-titre.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ClientComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FournisseurPages.clients;
    pageDef: PageDef = FournisseurPages.clients;

    site: Site;
    barre: BarreTitre;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
        protected siteService: SiteService,
    ) {
        super();
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        const modeTable = Fabrique.bouton.bouton({
            nom: 'table',
            contenu: { texte: '' }
        });
        modeTable.ajouteClasseDef('btn btn-light');
        const modes = Fabrique.barreTitre.groupe('modes');
        modes.ajoute(modeTable);

        const rafraichitModes = () => {
            modeTable.fixeTexte('Table: ' + this.service.modeTable);
            Fabrique.bouton.fixeActionBouton(modeTable, () => {
                this.service.changeModeTable(ModeTable.aperçu);
                modeTable.fixeTexte('Table: ' + this.service.modeTable);
            });
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
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    private rafraichit() {
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.siteService.navigation.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.rafraichit();
    }

}
