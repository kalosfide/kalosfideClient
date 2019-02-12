import { OnInit } from '@angular/core';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Site } from '../modeles/site';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { NavigationService } from '../services/navigation.service';

export abstract class SiteAccueilComponent extends PageBaseComponent implements OnInit {
    site: Site;

    get titre(): string {
        return 'Bienvenue chez ' + this.site.titre;
    }

    constructor(
        protected service: NavigationService,
    ) {
        super();
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    ngOnInit() {
        this.site = this.service.siteEnCours;
        this.créeContenus();
    }

}
