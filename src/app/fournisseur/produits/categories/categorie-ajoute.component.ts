import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategorieALESComponent } from './categorie-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages } from './categorie-pages';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styleUrls: ['../../../commun/commun.scss']
})
export class CategorieAjouteComponent extends CategorieALESComponent implements OnInit {

    static _pageDef: PageDef = CategoriePages.ajoute;
    pageDef: PageDef = CategoriePages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CategorieService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionAjoute();
        this.action.actionSiOk = () => this._service.quandAjoute(this.categorie);
    }

}
