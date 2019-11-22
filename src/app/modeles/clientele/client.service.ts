import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Client } from 'src/app/modeles/clientele/client';
import { KeyUidRnoService } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { compareKeyUidRno, copieKeyUidRno, texteKeyUidRno } from '../../commun/data-par-key/data-key';
import { ApiController, ApiAction } from '../../commun/api-route';
import { EtatClient } from './etat-client';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiRequêteService } from '../../services/api-requete.service';
import { ClientUtile } from './client-utile';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ApiResult200Ok } from 'src/app/commun/api-results/api-result-200-ok';

class Stock {
    siteUid: string;
    siteRno: number;
    identifiantUid: string;
    clients: Client[];
}

@Injectable({
    providedIn: 'root'
})
export class ClientService extends KeyUidRnoService<Client> {

    controllerUrl = ApiController.client;

    private _stockage: Stockage<Stock>;

    constructor(
        _stockageService: StockageService,
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
        this._stockage = _stockageService.nouveau<Stock>('Clients', { rafraichit: 'rafraichi', avecDate: true });
        this.créeUtile();
    }

    urlSegmentDeKey = (client: Client): string => {
        return texteKeyUidRno(client);
    }

    protected _créeUtile() {
        this._utile = new ClientUtile(this);
    }

    get utile(): ClientUtile {
        return this._utile as ClientUtile;
    }

    nomPris(nom: string): boolean {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        return !!stock.clients.find(s => s.nom === nom);
    }

    nomPrisParAutre(uid: string, rno: number, nom: string): boolean {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        return !!stock.clients.find(s => s.nom === nom && (s.uid !== uid || s.rno !== rno));
    }

    changeSiteNbClients(deltaNbClients: number) {
        const site = this.navigation.litSiteEnCours();
        site.nbClients += deltaNbClients;
        this.navigation.fixeSiteEnCours(site);
        this.identification.fixeSiteIdentifiant(site);
    }

    /**
     * change l'état d'un client
     * @param client client
     * @param etat
     */
    changeEtat(client: Client, etat: string) {
        client.etat = etat;
        // on ne transmet que la key et l'état
        const c = new Client();
        copieKeyUidRno(client, c);
        c.etat = etat;
        return this.put<Client>(ApiController.client, ApiAction.client.etat, c);
    }
    /** actionSiOk de changeEtat */
    quandEtatChange(client: Client) {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => compareKeyUidRno(c, client));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        stock.clients[index].etat = client.etat === EtatClient.exclu ? EtatClient.inactif : EtatClient.actif;
        stock.clients[index].dateEtat = new Date(Date.now());
        this._stockage.fixeStock(stock);
    }

    ajoute(objet: Client): Observable<ApiResult> {
        const site = this.navigation.litSiteEnCours();
        const params: { [param: string]: string } = this.créeParams(site);
        params['nom'] = objet.nom;
        params['adresse'] = objet.adresse;
        return this.get<Client>(this.controllerUrl, ApiAction.data.ajoute, params).pipe(
            tap((apiResult: ApiResult) => {
                if (apiResult.statusCode === ApiResult200Ok.code) {
                    const client = (apiResult as ApiResult200Ok<Client>).lecture;
                    objet.uid = client.uid;
                    objet.rno = client.rno;
                }
            })
        );
    }

    quandAjoute(ajouté: Client) {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        ajouté.dateEtat = new Date(Date.now());
        stock.clients.push(ajouté);
        this._stockage.fixeStock(stock);
        this.changeSiteNbClients(1);
    }

    quandEdite(édité: Client) {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => compareKeyUidRno(c, édité));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        Client.copieData(édité, stock.clients[index]);
        this._stockage.fixeStock(stock);
    }

    quandSupprime(supprimé: Client) {
        const stock = this._stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => compareKeyUidRno(c, supprimé));
        if (index === -1) {
            throw new Error('Clients: supprimé absent du stock');
        }
        stock.clients.splice(index, 1);
        this._stockage.fixeStock(stock);
    }

    private _clients$(siteUid: string, siteRno: number, identifiantUid: string): Observable<Client[]> {
        // c'est le fournisseur
        const keySite: KeyUidRno = { uid: siteUid, rno: siteRno };
        return this.objet<Client[]>(
            this.liste(keySite)
        ).pipe(
            take(1),
            tap(clients => {
                const stock: Stock = {
                    siteUid: siteUid,
                    siteRno: siteRno,
                    identifiantUid: identifiantUid,
                    clients: clients
                };
                this._stockage.fixeStock(stock);
            })
        );
    }

    /**
     * retourne un Observable d'une liste des clients du site en cours
     */
    clients$(): Observable<Client[]> {
        const stock = this._stockage.litStock();
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        if (!stock || stock.siteUid !== site.uid || stock.siteRno !== site.rno || stock.identifiantUid !== identifiant.uid) {
            return this._clients$(site.uid, site.rno, identifiant.uid);
        }
        return of(stock.clients);
    }

    rechargeClients(): Observable<Client[]> {
        const stock = this._stockage.litStock();
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        return this._clients$(site.uid, site.rno, identifiant.uid);
    }

    /**
     * retourne un Observable du Client
     *  - défini par uid et rno si uid et rno sont présents (l'utilisateur est le fournisseur du site encours)
     *  - de l'utilisateur si uid et rno sont absents (l'utilisateur est un client du site encours)
     * @param uid uid du client
     * @param rno rno du client
     */
    client$(uid?: string, rno?: number): Observable<Client> {
        if (uid) {
            return this.clients$().pipe(
                map(clients => {
                    const client = clients.find(c => c.uid === uid && c.rno === rno);
                    return client;
                })
            );
        } else {
            const site = this.navigation.litSiteEnCours();
            const identifiant = this.identification.litIdentifiant();
            const role = identifiant.roleNo(site);
            if (role) {
                return this.objet<Client>(this.lit({
                    uid: identifiant.uid,
                    rno: role
                }));
            }
        }
    }

}
