import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Catalogue, CatalogueApi } from './catalogue';
import { map, take, switchMap } from 'rxjs/operators';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { DataService } from '../../services/data.service';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { EtatsProduits } from './etat-produit';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Site } from '../site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { SiteService } from '../site/site.service';
import { IdEtatSite } from '../etat-site';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService extends DataService {

    controllerUrl = ApiController.catalogue;

    private _stockage: {
        actuel: Stockage<Catalogue>,
        tarif: Stockage<Catalogue>
    };

    constructor(
        protected _apiRequete: ApiRequêteService,
        _stockageService: StockageService,
        private _siteService: SiteService,
    ) {
        super(_apiRequete);
        this._stockage = {
            actuel: _stockageService.nouveau<Catalogue>('Catalogue', { rafraichit: 'rafraichi' }),
            tarif: _stockageService.nouveau<Catalogue>('Tarif', { rafraichit: 'rafraichi' })
        };
    }

    /**
     * Retourne un catalogue ne contenant que les produits disponibles du catalogue initial et leurs catégories.
     * Stocke le résultat dans actuel
     * @param stock
     */
    private réduitAuxDisponibles(stock: Catalogue): Catalogue {
        if (Catalogue.estDesDisponibles(stock)) {
            return stock;
        }
        stock = Catalogue.filtre(stock, p => p.etat === EtatsProduits.disponible.valeur);
        Catalogue.fixeAvecIndisponibles(stock, false);
        this._stockage.actuel.fixeStock(stock);
        return stock;
    }

    /**
     * dans actuel
     */
    litStock(): Catalogue {
        const stock = this._stockage.actuel.litStock();
        if (!stock) {
            throw new Error('Catalogue: Pas de stock');
        }
        return stock;
    }
    /**
     * dans actuel
     * @param stock
     */
    fixeStock(stock: Catalogue) {
        this._stockage.actuel.fixeStock(stock);
    }

    effaceStockSiObsolete(date: Date): boolean {
        const stock = this._stockage.actuel.litStock();
        if (stock) {
            const dateStock = new Date(stock.date);
            const dateCatalogue = new Date(date);
            if (dateStock < dateCatalogue) {
                this._stockage.actuel.initialise();
                return true;
            }
        }
    }

    private _litAPI(actionDef: { apiAction: string; params: { [param: string]: string }; }): Observable<CatalogueApi> {
        const apiResult$ = this.get<CatalogueApi>(ApiController.catalogue, actionDef.apiAction, actionDef.params);
        return this.objet<CatalogueApi>(apiResult$);
    }

    /**
     * retourne vrai si le catalogue de l'Api est plus récent
     * @param catalogue
     */
    private _catalogueObsolete$(catalogue: Catalogue): Observable<boolean> {
        const params: { [param: string]: string } = {
            'uid': catalogue.uid,
            'rno': '' + catalogue.rno,
            'date': catalogue.date.toString() // un catalogue des disponibles a une date
        };
        return this.objet(this.get<boolean>(ApiController.catalogue, ApiAction.catalogue.obsolete, params));
    }

    /**
     * Retourne un Observable d'un catalogue créé à partir d'un catalogueApi lu dans l'Api.
     * Stocke dans actuel
     * @param site
     * @param complet si pas vrai, le catalogue ne contient que les disponibles
     */
    private _catalogue$(site: Site, complet: boolean): Observable<Catalogue> {
        const apiAction = complet ? ApiAction.catalogue.complet : ApiAction.catalogue.disponible;
        const actionDef: { apiAction: string; params: { [param: string]: string }; } = {
            apiAction: apiAction,
            params: KeyUidRno.créeParams(site)
        };
        return this._litAPI(actionDef).pipe(
            map(catalogueApi => {
                const nouveauStock: Catalogue = Catalogue.nouveau(catalogueApi);
                Catalogue.fixeAvecIndisponibles(nouveauStock, complet);
                this._stockage.actuel.fixeStock(nouveauStock);
                return nouveauStock;
            }
            )
        );
    }

    /**
     * Retourne un Observable du catalogue complet en vigueur stocké dans actuel ou créé à partir d'une lecture de l'Api.
     * Stocke dans actuel
     */
    private catalogueComplet$(site: Site): Observable<Catalogue> {
        const stock = this._stockage.actuel.litStock();
        if (!stock // pas de stock
            || (site.uid !== stock.uid || site.rno !== stock.rno) // site changé
            || !Catalogue.estAvecIndisponibles(stock) // stock incomplet ou tarif
        ) {
            return this._catalogue$(site, true);
        }
        return of(stock);
    }

    /**
     * Retourne un Observable du catalogue des disponibles en vigueur stocké dans actuel ou créé à partir d'une lecture de l'Api.
     * Stocke dans actuel
     */
    private _catalogueDisponibles$(site: Site, identifiant: Identifiant): Observable<Catalogue> {
        const stock = this._stockage.actuel.litStock();
        if (!stock // pas de stock
            || (site.uid !== stock.uid || site.rno !== stock.rno) // site changé
        ) {
            return this._catalogue$(site, false);
        }
        if (!identifiant || identifiant.estClient(site)) {
            return this._catalogueObsolete$(stock).pipe(
                take(1),
                switchMap(obsolète => {
                    if (obsolète) {
                        return this._catalogue$(site, false);
                    }
                    return of(this.réduitAuxDisponibles(stock));
                })
            );
        }
        return of(this.réduitAuxDisponibles(stock));
    }

    /**
     * retourne le catalogue complet si l'identifiant est le fournisseur, des disponibles sinon
     */
    catalogue$(): Observable<Catalogue> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        if (!!identifiant && identifiant.estFournisseur(site)) {
            return this.catalogueComplet$(site);
        } else {
            return this._catalogueDisponibles$(site, identifiant);
        }
    }

    /**
     * retourne le catalogue des disponibles
     */
    catalogueDisponibles$(): Observable<Catalogue> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        return this._catalogueDisponibles$(site, identifiant);
    }

    tarifCommande$(apiCommande: ApiCommande): Observable<Catalogue> {
        const stock = this._stockage.actuel.litStock();
        let tarif = this._stockage.tarif.litStock();
        if (tarif) {
            const apiCommandeStockée = Catalogue.apiCommande(tarif);
            if (apiCommandeStockée && KeyUidRnoNo.compareKey(apiCommandeStockée, apiCommande)) {
                return of(tarif);
            }
        }
        if (stock && (!apiCommande.date || stock.date < apiCommande.date)) {
            tarif = Catalogue.filtre(stock, p => !!apiCommande.details.find(d => d.no === p.no));
            return of(tarif);
        }
        const actionDef: { apiAction: string; params: { [param: string]: string }; } = {
            apiAction: ApiAction.catalogue.commande,
            params: KeyUidRnoNo.créeParams(apiCommande)
        };
        return this._litAPI(actionDef).pipe(
            map(catalogueApi => {
                const nouveauStock: Catalogue = Catalogue.nouveau(catalogueApi);
                Catalogue.fixeApiCommande(nouveauStock, apiCommande);
                this._stockage.tarif.fixeStock(nouveauStock);
                return nouveauStock;
            }
            )
        );
    }

    tarifLivraison$(): Observable<Catalogue> {
        return null;
    }

    // ACTIONS
    commenceModification(site: Site): Observable<ApiResult> {
        return this.post(ApiController.catalogue, ApiAction.catalogue.commence, null, KeyUidRno.créeParams(site));
    }
    commenceModificationOk(site: Site) {
        this._siteService.changeEtatOk(site, IdEtatSite.catalogue);
    }

    termineModification(site: Site): Observable<ApiResult> {
        return this.post(ApiController.catalogue, ApiAction.catalogue.termine, null, KeyUidRno.créeParams(site));
    }
    termineModificationOk(site: Site) {
        this._siteService.changeEtatOk(site, IdEtatSite.ouvert);
    }
}
