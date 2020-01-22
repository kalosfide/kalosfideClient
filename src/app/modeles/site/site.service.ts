import { Injectable } from '@angular/core';
import { Site } from './site';
import { Observable, of } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiAction, ApiController } from '../../commun/api-route';
import { KeyUidRnoService } from '../../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { map, tap } from 'rxjs/operators';
import { ApiResult200Ok } from '../../commun/api-results/api-result-200-ok';
import { ApiRequêteService } from '../../services/api-requete.service';
import { IdentificationService } from '../../securite/identification.service';
import { IdEtatSite } from '../etat-site';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { SiteUtile } from './site-utile';

@Injectable({
    providedIn: 'root'
})
export class SiteService extends KeyUidRnoService<Site> {

    controllerUrl = ApiController.site;

    constructor(
        protected _apiRequete: ApiRequêteService,
    ) {
        super(_apiRequete);
        this.créeUtile();
    }

    protected _créeUtile() {
        this._utile = new SiteUtile(this);
    }

    get utile(): SiteUtile {
        return this._utile as SiteUtile;
    }

    public trouveParNom(nomSite: string): Observable<Site> {
        const identifiant = this.identification.litIdentifiant();
        if (identifiant && identifiant.sites) {
            const site: Site = identifiant.sites.find(s => s.nomSite === nomSite);
            if (site) {
                return of(site);
            }
        }
        return this.objet<Site>(this.get<Site>(this.controllerUrl, ApiAction.site.trouveParNom, nomSite));
    }

    public recharge(): Observable<Site> {
        const actuel = this.navigation.litSiteEnCours();
        return this.objet<Site>(this.lit(actuel)).pipe(
            tap(nouveau => {
                if (nouveau.etat !== actuel.etat) {
                    this.navigation.fixeSiteEnCours(nouveau);
                }
            })
        );
    }

    public nomPris(nom: string): Observable<boolean> {
        return this.get<boolean>(this.controllerUrl, ApiAction.site.nomPris, nom).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public nomPrisParAutre(nom: string): Observable<boolean> {
        return this.get<boolean>(this.controllerUrl, ApiAction.site.nomPrisParAutre, nom).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public titrePris(titre: string): Observable<boolean> {
        return this.get<boolean>(this.controllerUrl, ApiAction.site.titrePris, titre).pipe(
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    public titrePrisParAutre(titre: string): Observable<boolean> {
        return this.objet(this.get<boolean>(this.controllerUrl, ApiAction.site.titrePrisParAutre, titre));
    }

    public changeEtat(site: Site, état: IdEtatSite): Observable<ApiResult> {
        const vue = new Site();
        KeyUidRno.copieKey(site, vue);
        vue.etat = état;
        return this.put<Site>(this.controllerUrl, ApiAction.site.etat, vue);
    }

    public changeEtatOk(site: Site, état: IdEtatSite) {
        site.etat = état;
        this.navigation.fixeSiteEnCours(site);
        this.identification.fixeSiteIdentifiant(site);
    }
}
