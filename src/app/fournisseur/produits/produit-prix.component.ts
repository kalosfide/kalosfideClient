import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages, ProduitRoutes } from './produit-pages';
import { Site } from 'src/app/modeles/site';
import { ProduitALESComponent } from './produit-ales.component';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { IdEtatProduit } from 'src/app/modeles/catalogue/etat-produit';
import { Produit } from 'src/app/modeles/catalogue/produit';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ProduitPrixComponent extends ProduitALESComponent implements OnInit {

    static _pageDef: PageDef = ProduitPages.prix;
    pageDef: PageDef = ProduitPages.prix;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = {
            nom: this.pageDef.urlSegment,
            texteSoumettre: 'Fixer le prix',
            apiDemande: () => {
                const produitPrix = new Produit();
                produitPrix.uid = this.produit.uid;
                produitPrix.rno = this.produit.rno;
                produitPrix.no = this.produit.no;
                produitPrix.prix = this.produit.prix;
                produitPrix.etat = this.produit.etat;
                return this._service.edite(produitPrix);
            },
            actionSiOk: () => {
                if (this.produit.etat === IdEtatProduit.disponible && !this.produitChargéDisponible) {
                    this.metAJourNbProduits(1);
                }
                if (this.produit.etat !== IdEtatProduit.disponible && this.produitChargéDisponible) {
                    this.metAJourNbProduits(-1);
                }
                this._service.quandEdite(this.produit);
            }
        };
    }

}
