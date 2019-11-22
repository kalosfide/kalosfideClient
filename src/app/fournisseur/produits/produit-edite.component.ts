import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitALESComponent } from './produit-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages } from './produit-pages';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ProduitEditeComponent extends ProduitALESComponent {

    static _pageDef: PageDef = ProduitPages.edite;
    pageDef: PageDef = ProduitPages.edite;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionEdite();
        this.action.actionSiOk = () => this._service.quandEdite(this.produit);
    }

}
