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
export class ProduitSupprimeComponent extends ProduitALESComponent {

    static _pageDef: PageDef = ProduitPages.supprime;
    pageDef: PageDef = ProduitPages.supprime;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionSupprime();
        this.action.actionSiOk = () => this._service.quandSupprime(this.produit);
    }

}
