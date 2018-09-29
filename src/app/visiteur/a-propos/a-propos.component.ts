import { Component, OnInit } from '@angular/core';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { SiteInfoStaticService } from '../../site-info/site-info-static.service';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../../disposition/page-base/page-base.component.html',
})
export class AProposComponent extends PageBaseComponent implements OnInit {

    nom = 'a_propos';
    titreHtml: string;
    titre: string;
    private _titre = 'A propos';
    chargeAsync = null;
    superGroupe: KfSuperGroupe;

    constructor(
        protected service: SiteInfoStaticService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(titleService, titreHtmlService, attenteAsyncService);
        this.titre = this._titre + ' de ' + this.service.siteInfo.titre;
        this.titreHtml = this.titre;
        this.créeContenus();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(new KfEtiquette('texte', 'a-propos works!'));
        this.superGroupe.quandTousAjoutés();
    }

    ngOnInit() {
        this.ngOnInit_TitreHtml();
        this.ngOnInit_Charge();
    }

}
