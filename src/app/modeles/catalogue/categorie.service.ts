import { Injectable } from '@angular/core';
import { ApiController } from '../../commun/api-route';
import { Categorie } from './categorie';
import { KeyUidRnoNoService } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { CatalogueService } from './catalogue.service';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { CatalogueUtile } from './catalogue-utile';
import { CategorieUtile } from './categorie-utile';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class CategorieService extends KeyUidRnoNoService<Categorie> {

    controllerUrl = ApiController.categorie;

    constructor(
        private _catalogueService: CatalogueService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this.créeUtile();
    }

    protected _créeUtile() {
        this._utile = new CategorieUtile(this);
    }

    get utile(): CategorieUtile {
        return this._utile as CategorieUtile;
    }

    catégories$(): Observable<Categorie[]> {
        return this._catalogueService.catalogue$().pipe(
            map((catalogue: Catalogue) => {
                catalogue.catégories.forEach(c => c.nbProduits = catalogue.produits.filter(p => p.categorieNo === c.no).length);
                return catalogue.catégories;
            })
        );
    }

    catégorie$(no: number): Observable<Categorie> {
        return this._catalogueService.catalogue$().pipe(
            map((catalogue: Catalogue) => catalogue.catégories.find(c => c.no === no))
        );
    }

    nomPris(nom: string): boolean {
        const stock = this._catalogueService.litStock();
        return !!stock.catégories.find(s => s.nom === nom);
    }

    nomPrisParAutre(no: number, nom: string): boolean {
        const stock = this._catalogueService.litStock();
        return !!stock.catégories.find(s => s.nom === nom && s.no !== no);
    }

    quandAjoute(ajouté: Categorie) {
        const stock = this._catalogueService.litStock();
        stock.catégories.push(ajouté);
        this._catalogueService.fixeStock(stock);
    }

    quandEdite(édité: Categorie) {
        const stock = this._catalogueService.litStock();
        const index = stock.catégories.findIndex(s => s.no === édité.no);
        if (index === -1) {
            throw new Error('Catégories: édité absent du stock');
        }
        stock.catégories[index].copieData(édité);
        this._catalogueService.fixeStock(stock);
    }

    quandSupprime(supprimé: Categorie) {
        const stock = this._catalogueService.litStock();
        const index = stock.catégories.findIndex(s => s.no === supprimé.no);
        if (index === -1) {
            throw new Error('Catégories: supprimé absent du stock');
        }
        stock.catégories.splice(index, 1);
        this._catalogueService.fixeStock(stock);
    }

}
