import { KeyUidRnoNoService } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiCommande, ApiDétailCommande, ApiDétailCommandeData } from './api-commande';
import { DetailCommande } from './detail-commande';
import { Observable, Subscription } from 'rxjs';
import { ApiAction, ApiController } from '../commun/api-route';
import { copieKeyUidRno } from '../commun/data-par-key/data-key';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { ApiResult } from '../commun/api-results/api-result';
import { KeyUidRnoNo2CréeParams } from '../commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { ICommandeStock } from './i-commande-stock';
import { IKeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiRequêteService } from '../services/api-requete.service';
import { IdEtatSite } from '../modeles/etat-site';
import { CommandeUtile } from './commande-utile';
import { Site } from '../modeles/site';
import { ModeTable } from '../commun/data-par-key/condition-table';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';
import { ModeAction } from './condition-action';
import { ApiErreur400Traite } from '../commun/api-results/api-erreur-400';


export abstract class CommandeService extends KeyUidRnoNoService<ApiCommande> {

    controllerUrl = 'commande';

    private _modeActionIO: KfInitialObservable<ModeAction>;
    private _subscriptionDeModeTableAModeAction: Subscription;

    constructor(
        protected _apiRequete: ApiRequêteService
    ) {
        super(_apiRequete);
    }

    redirigeSiErreur400: () => ApiErreur400Traite[];
    actionSiErreur: (groupe: KfGroupe) => void;

    quandEtatCommandeChangé: () => void;

    abstract stock$(): Observable<ICommandeStock>;
    abstract litStock(): ICommandeStock;
    abstract fixeStock(stock: ICommandeStock): void;
    abstract commandeStockée(stock: ICommandeStock, ikeyClient: IKeyUidRno): ApiCommande;
    abstract stockeCommande(stock: ICommandeStock, commande: ApiCommande): void;
    abstract déstockeCommande(stock: ICommandeStock, ikeyCommande: IKeyUidRnoNo): void;

    /**
     * crée une nouvelle commande vide d'un client
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    abstract créeVide(ikeyClient: IKeyUidRno): Observable<ApiResult>;
    /** actionSiOk de créeVide */
    abstract siCréeVideOk(ikeyClient: IKeyUidRno);
    /**
     * crée une nouvelle commande d'un client en copiant les détails de la commande précédente
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    abstract créeCopie(ikeyClient: IKeyUidRno): Observable<ApiResult>;
    /** actionSiOk de créeCopie */
    abstract siCréeCopieOk(ikeyClient: IKeyUidRno): void;

    protected abstract get transformeSiteFnc(): (site: Site) => ModeAction;

    private get transformeModeFnc(): (modeAction: ModeAction) => ModeTable {
        return (modeAction: ModeAction) => {
            switch (modeAction) {
                case ModeAction.aperçu:
                    return ModeTable.aperçu;
                case ModeAction.aucun:
                    return ModeTable.sans;
                case ModeAction.envoi:
                    return ModeTable.bilan;
                case ModeAction.doitCréer:
                    return ModeTable.aperçu;
                case ModeAction.supprime:
                    return ModeTable.aperçu;
                default:
                    return ModeTable.edite;
            }
        };
    }

    private modeTableSouscritAModeAction() {
        this._subscriptionDeModeTableAModeAction = this._modeActionIO.observable.subscribe(modeAction => {
            this._modeTableIO.changeValeur(this.transformeModeFnc(modeAction));
        });
    }

    créeUtile() {
        const site = this.navigation.litSiteEnCours();
        this._modeActionIO = KfInitialObservable.nouveau<ModeAction>(this.transformeSiteFnc(site));
        const siteObs = this.navigation.siteObs();
        siteObs.subscribe(site1 => {
            this._modeActionIO.changeValeur(this.transformeSiteFnc(site1));
        });
        this._modeTableIO = KfInitialObservable.nouveau<ModeTable>(this.transformeModeFnc(this._modeActionIO.valeur));
        this.modeTableSouscritAModeAction();
        this._créeUtile();
        this._utile.observeModeTable(this._modeTableIO);
        this.utile.observeModeAction(this._modeActionIO);
        this.utile.créeAutresConditions();
    }

    initialiseModeAction(modeAction: ModeAction, modeTable?: ModeTable) {
        if (modeAction) {
            if (modeTable) {
                this._subscriptionDeModeTableAModeAction.unsubscribe();
            }
            this.changeMode(modeAction);
            if (modeTable) {
                this.modeTableSouscritAModeAction();
            }
        }
        if (modeTable) {
            this._modeTableIO.changeValeur(modeTable);
        }
    }

    get modeActionIO(): KfInitialObservable<ModeAction> {
        return this._modeActionIO;
    }

    get modeAction(): ModeAction {
        return this._modeActionIO.valeur;
    }

    changeMode(mode: ModeAction) {
        this._modeActionIO.changeValeur(mode);
    }

    get utile(): CommandeUtile {
        return this._utile as CommandeUtile;
    }

    // Actions sur les détails

    protected paramsEditeDétail(): { [param: string]: string } {
        return undefined;
    }
    /**
     * ajoute ou modifie un détail de commande
     * @param détail CommandeLigne du détail à ajouter ou à modifier
     * @param ajout true pour un ajout
     */
    editeDétail(détail: DetailCommande, ajout?: boolean): Observable<ApiResult> {
        const apiDétail = détail.apiDetailAEnvoyer();
        return ajout
            ? this.post<ApiDétailCommande>(ApiController.commande, ApiAction.commande.ajoute, apiDétail, this.paramsEditeDétail())
            : this.put<ApiDétailCommande>(ApiController.commande, ApiAction.commande.edite, apiDétail, this.paramsEditeDétail());
    }
    /** actionSiOk de editeDétail */
    siEditeDétailOk(détail: DetailCommande, ajout?: boolean) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        const commande = this.commandeStockée(stock, détail.apiDétail);
        let apiDétailCommandeData: ApiDétailCommandeData;
        if (ajout) {
            apiDétailCommandeData = détail.apiDétailDataAStocker();
            commande.details.push(apiDétailCommandeData);
        } else {
            apiDétailCommandeData = commande.details.find(d => d.no === détail.produit.no);
            détail.fixeData(apiDétailCommandeData);
        }
        this.fixeStock(stock);
    }

    protected paramsSupprimeDétail(apiDétail: ApiDétailCommande): { [param: string]: string } {
        return KeyUidRnoNo2CréeParams(apiDétail);
    }
    /**
     * supprime un détail de commande
     * @param détail détail à supprimer
     */
    supprimeDétail(détail: DetailCommande): Observable<ApiResult> {
        const apiDétail = détail.créeApiDetailClé();
        return this.delete(ApiController.commande, ApiAction.commande.supprime, this.paramsSupprimeDétail(apiDétail));
    }
    /** actionSiOk de supprimeDétail */
    siSupprimeDétailOk(détail: DetailCommande) {
        const stock = this.litStock();
        if (!stock) {
            throw new Error('Commandes: Pas de stock');
        }
        const commande = this.commandeStockée(stock, détail.apiCommande);
        const index = commande.details.findIndex(d => d.no === détail.produit.no);
        if (index === -1) {
            throw new Error('Commandes: supprimé absent du stock');
        }
        commande.details.splice(index, 1);
        this.fixeStock(stock);
    }

    // Action sur la commande

    /** actionSiOk des crée... */
    private siCréeOk(ikeyClient: IKeyUidRno, copieDétails: boolean) {
        const stock = this.litStock();
        let commande = this.commandeStockée(stock, ikeyClient);
        const site = this.navigation.litSiteEnCours();
        if (commande) {
            // mise à jour du numéro de commande et effacement de la date
            commande.no++;
            commande.date = undefined;
            // mise à jour des numéros de commande et de livraison
            commande.livraisonNo = site.etat === IdEtatSite.livraison
                ? stock.livraisonNo
                : undefined;
            if (copieDétails) {
                const identifiant = this.identification.litIdentifiant();
                if (identifiant.estFournisseur(site)) {
                    commande.details = commande.details.map((d: ApiDétailCommande) => {
                        d.aLivrer = undefined;
                        d.date = undefined;
                        return d;
                    });
                } else {
                    const date = new Date(Date.now());
                    commande.details = commande.details.map((d: ApiDétailCommande) => {
                        d.aLivrer = undefined;
                        d.date = date;
                        return d;
                    });
                }
            } else {
                commande.details = [];
            }
        } else {
            // c'est la première commande du client
            commande = new ApiCommande();
            copieKeyUidRno(ikeyClient, commande);
            commande.no = 1;
            if (site.etat === IdEtatSite.livraison) {
                commande.livraisonNo = stock.livraisonNo;
            }
            commande.details = [];
            this.stockeCommande(stock, commande);
        }
        this.fixeStock(stock);
        if (this.quandEtatCommandeChangé) {
            this.quandEtatCommandeChangé();
        }
    }

    protected paramsCréeCommande(ikeyClient: IKeyUidRno): { [param: string]: string } {
        return this.créeParams(ikeyClient);
    }
    /**
     * crée une nouvelle commande vide d'un client
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    protected _créeVide(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        return this.post(ApiController.commande, ApiAction.commande.nouveau, null, this.paramsCréeCommande(ikeyClient));
    }
    /** actionSiOk de créeVide */
    protected _siCréeVideOk(ikeyClient: IKeyUidRno) {
        this.siCréeOk(ikeyClient, false);
    }

    /**
     * crée une nouvelle commande d'un client en copiant les détails de la commande précédente
     * @param ikeyClient tout objet ayant l'uid et le rno du client
     */
    protected _créeCopie(ikeyClient: IKeyUidRno): Observable<ApiResult> {
        const stock = this.litStock();
        return this.post(ApiController.commande, ApiAction.commande.copie, null, this.paramsCréeCommande(ikeyClient));
    }
    /** actionSiOk de créeCopie */
    protected _siCréeCopieOk(ikeyClient: IKeyUidRno) {
        this.siCréeOk(ikeyClient, true);
    }

    /**
    * Supprime les détails de la commande créés par l'utilisateur. S'il reste des détails, fixe leur aLivrer à 0.
    * S'il n'y a plus de détails, supprime la commande.
     * @param ikeyCommande tout objet ayant l'uid, le rno et le no de la commande
     */
    supprimeOuRefuse$(ikeyCommande: IKeyUidRnoNo) {
        return this.post(ApiController.commande, ApiAction.commande.efface, null, this.créeParams(ikeyCommande));
    }
    /** actionSiOk de supprimeOuRefuse si l'utilisateur est le fournisseur */
    siSupprimeOuRefuseOk(ikeyCommande: IKeyUidRnoNo, estLeClient: boolean) {
        const stock = this.litStock();
        const commande = this.commandeStockée(stock, ikeyCommande);
        if (estLeClient) {
            commande.details = [];
            // this.déstockeCommande(stock, ikeyCommande);
        } else {
            // les détails créés par l'utilisateur ont une date
            commande.details = commande.details.filter(d => !!d.date);
            if (commande.details.length === 0) {
                this.déstockeCommande(stock, ikeyCommande);
            } else {
                commande.details.forEach(d => d.aLivrer = 0);
            }
        }
        this.fixeStock(stock);
    }

    private fixeDate(commande: ApiCommande) {
        commande.date = new Date(Date.now());
    }

}
