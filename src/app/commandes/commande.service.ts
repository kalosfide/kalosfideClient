import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiCommande, ApiDétailCommande, ApiDétailCommandeData } from './api-commande';
import { DetailCommande } from './detail-commande';
import { Observable } from 'rxjs';
import { ApiAction, ApiController } from '../commun/api-route';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { ApiResult } from '../commun/api-results/api-result';
import { KeyUidRnoNo2 } from '../commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { ICommandeStock } from './i-commande-stock';
import { IKeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiRequêteService } from '../services/api-requete.service';
import { IdEtatSite } from '../modeles/etat-site';
import { ApiErreur400Traite } from '../commun/api-results/api-erreur-400';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { CommandeActionService } from './commande-action.service';
import { Produit } from '../modeles/catalogue/produit';
import { DATE_NULLE } from '../modeles/date-nulle';

export abstract class CommandeService extends CommandeActionService {

    controllerUrl = 'commande';

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

    public produit(stock: ICommandeStock, noString: string): Produit {
        if (noString) {
            const produit: Produit = stock.catalogue.produits.find(p => p.no === +noString);
            if (produit) {
                produit.nomCategorie = stock.catalogue.catégories.find(c => produit.categorieNo === c.no).nom;
                return produit;
            }
        }
    }

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

    // Actions sur les détails

    protected paramsEditeDétail(): { [param: string]: string } {
        return undefined;
    }
    private _editeDétail(détail: DetailCommande, ajout?: boolean): Observable<ApiResult> {
        const apiDétail = détail.apiDetailAEnvoyer();
        return ajout
            ? this.post<ApiDétailCommande>(ApiController.commande, ApiAction.commande.ajoute, apiDétail, this.paramsEditeDétail())
            : this.put<ApiDétailCommande>(ApiController.commande, ApiAction.commande.edite, apiDétail, this.paramsEditeDétail());
    }
    /**
     * ajoute ou modifie un détail de commande
     * @param détail CommandeLigne du détail à ajouter ou à modifier
     * @param ajout true pour un ajout
     */
    editeDétail(détail: DetailCommande, ajout?: boolean): Observable<ApiResult> {
        return this._editeDétail(détail, ajout);
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
        return KeyUidRnoNo2.créeParams(apiDétail);
    }
    protected _supprimeDétail(détail: DetailCommande): Observable<ApiResult> {
        const apiDétail = détail.créeApiDetailClé();
        return this.delete(ApiController.commande, ApiAction.commande.supprime, this.paramsSupprimeDétail(apiDétail));
    }
    /**
     * supprime un détail de commande
     * @param détail détail à supprimer
     */
    supprimeDétail(détail: DetailCommande): Observable<ApiResult> {
        return this._supprimeDétail(détail);
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
        const identifiant = this.identification.litIdentifiant();
        if (commande) {
            // mise à jour du numéro de commande
            commande.no++;
            if (identifiant.estFournisseur(site)) {
                commande.date = DATE_NULLE;
                commande.livraisonNo = stock.livraisonNo;
            } else {
                commande.date = undefined;
            }
            if (copieDétails) {
                commande.details = commande.details.map((d: ApiDétailCommande) => {
                    d.aLivrer = undefined;
                    return d;
                });
            } else {
                commande.details = [];
            }
        } else {
            // c'est la première commande du client
            commande = new ApiCommande();
            KeyUidRno.copieKey(ikeyClient, commande);
            commande.no = 1;
            if (identifiant.estFournisseur(site)) {
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
        return KeyUidRno.créeParams(ikeyClient);
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
        return this.post(ApiController.commande, ApiAction.commande.copie, null, this.paramsCréeCommande(ikeyClient));
    }
    /** actionSiOk de créeCopie */
    protected _siCréeCopieOk(ikeyClient: IKeyUidRno) {
        this.siCréeOk(ikeyClient, true);
    }

    protected paramsAnnuleCommande(ikeyClient: IKeyUidRno): { [param: string]: string } {
        return KeyUidRno.créeParams(ikeyClient);
    }
    /**
    * Supprime les détails de la commande créés par l'utilisateur. S'il reste des détails, fixe leur aLivrer à 0.
    * S'il n'y a plus de détails, supprime la commande.
     * @param ikeyCommande tout objet ayant l'uid, le rno et le no de la commande
     */
    supprimeOuRefuse$(ikeyCommande: IKeyUidRnoNo) {
        return this.post(ApiController.commande, ApiAction.commande.efface, null, this.paramsAnnuleCommande(ikeyCommande));
    }
    /** actionSiOk de supprimeOuRefuse si l'utilisateur est le fournisseur */
    siSupprimeOuRefuseOk(ikeyCommande: IKeyUidRnoNo, estLeClient: boolean) {
        const stock = this.litStock();
        const commande = this.commandeStockée(stock, ikeyCommande);
        if (estLeClient) {
            commande.details = [];
            // this.déstockeCommande(stock, ikeyCommande);
        } else {
            if (commande.date === DATE_NULLE) {
                // supprime
                this.déstockeCommande(stock, ikeyCommande);
            } else {
                // refuse
                commande.details.forEach(d => d.aLivrer = 0);
            }
        }
        this.fixeStock(stock);
    }


}
