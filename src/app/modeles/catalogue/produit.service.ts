import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiController, ApiAction } from '../../commun/api-route';
import { Produit } from './produit';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { EtatsProduits } from './etat-produit';
import { CatalogueService } from './catalogue.service';
import { Catalogue } from './catalogue';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { CatalogueUtile } from './catalogue-utile';
import { ProduitUtile } from './produit-utile';
import { ApiResult } from 'src/app/commun/api-results/api-result';


@Injectable({
    providedIn: 'root'
})
export class ProduitService extends KeyUidRnoNoService<Produit> {

    controllerUrl = ApiController.produit;

    constructor(
        private _catalogueService: CatalogueService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this.créeUtile();
    }

    protected _créeUtile() {
        this._utile = new ProduitUtile(this);
    }

    get utile(): ProduitUtile {
        return this._utile as ProduitUtile;
    }

    changeSiteNbProduits(deltaNbProduits: number) {
        const site = this.navigation.litSiteEnCours();
        site.nbProduits += deltaNbProduits;
        this.navigation.fixeSiteEnCours(site);
        this.identification.fixeSiteIdentifiant(site);
    }

    catalogue$(): Observable<Catalogue> {
        return this._catalogueService.catalogue$();
    }

    litProduits(): Produit[] {
        const stock = this._catalogueService.litStock();
        return stock.produits;
    }
    litProduit(no: number) {
        const stock = this._catalogueService.litStock();
        return stock.produits.find(p => p.no === no);
    }

    nomPris(nom: string): boolean {
        const stock = this._catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom);
    }

    nomPrisParAutre(no: number, nom: string): boolean {
        const stock = this._catalogueService.litStock();
        return !!stock.produits.find(s => s.nom === nom && s.no !== no);
    }

    quandAjoute(ajouté: Produit) {
        const stock = this._catalogueService.litStock();
        stock.produits.push(ajouté);
        this._catalogueService.fixeStock(stock);
        if (ajouté.etat === EtatsProduits.disponible.valeur) {
            this.changeSiteNbProduits(1);
        }
    }

    quandEdite(édité: Produit) {
        const stock = this._catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === édité.no);
        if (index === -1) {
            throw new Error('Produits: édité absent du stock');
        }
        const stocké = stock.produits[index];
        const étatAvant = stocké.etat;
        Produit.copieData(édité, stocké);
        this._catalogueService.fixeStock(stock);
        if (stocké.etat !== étatAvant) {
            this.changeSiteNbProduits(stocké.etat === EtatsProduits.disponible.valeur ? 1 : -1);
        }
    }

    quandSupprime(produit: Produit) {
        const stock = this._catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === produit.no);
        if (index === -1) {
            throw new Error('Produits: supprimé absent du stock');
        }
        const stocké = stock.produits[index];
        stock.produits.splice(index, 1);
        this._catalogueService.fixeStock(stock);
        if (stocké.etat === EtatsProduits.disponible.valeur) {
            this.changeSiteNbProduits(-1);
        }
    }

    prix(produit: Produit): Observable<ApiResult> {
        const produitPrix = {
            uid: produit.uid,
            rno: produit.rno,
            no: produit.no,
            prix: produit.prix
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitPrix);
    }

    prixOk(produit: Produit) {
        const stock = this._catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === produit.no);
        if (index === -1) {
            throw new Error('Produits: prix absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.prix = produit.prix;
        this._catalogueService.fixeStock(stock);
    }

    etat(produit: Produit): Observable<ApiResult> {
        const produitEtat = {
            uid: produit.uid,
            rno: produit.rno,
            no: produit.no,
            etat: produit.etat
        };
        return this.put(ApiController.produit, ApiAction.produit.edite, produitEtat);
    }

    etatOk(produit: Produit) {
        const stock = this._catalogueService.litStock();
        const index = stock.produits.findIndex(s => s.no === produit.no);
        if (index === -1) {
            throw new Error('Produits: etat absent du stock');
        }
        const stocké = stock.produits[index];
        stocké.etat = produit.etat;
        this._catalogueService.fixeStock(stock);
    }
}
