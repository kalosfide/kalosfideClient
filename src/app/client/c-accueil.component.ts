import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { ClientPages } from './client-pages';
import { BarreTitre } from '../disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { Site } from '../modeles/site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
    styleUrls: ['../commun/commun.scss']
})
export class CAccueilComponent extends PageBaseComponent implements OnInit {

    static _pageDef: PageDef = ClientPages.accueil;
    pageDef: PageDef = ClientPages.accueil;

    site: Site;
    barre: BarreTitre;

    get titre(): string {
        return this.site.titre;
    }

    constructor(
        protected service: NavigationService,
    ) {
        super();
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        barre.ajoute(Fabrique.barreTitre.groupeAccès('client'));

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
        this.barre.site = this.service.litSiteEnCours();
        this.barre.rafraichit();
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
