import { Commande } from 'src/app/commandes/commande';
import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { ISiteRoutes, SiteRoutes } from 'src/app/site/site-pages';
import { LivraisonRoutes, LivraisonPages } from '../fournisseur/livraisons/livraison-pages';
import { LivraisonProduit } from '../fournisseur/livraisons/livraison-produit';
import { CommanderRoutes } from '../client/commandes/commander-pages';
import { CommandePages } from './commande-pages';
import { CommandeUtile } from './commande-utile';
import { Client } from '../modeles/client/client';
import { Produit } from '../modeles/catalogue/produit';
import { DataUtileUrl } from '../commun/data-par-key/data-utile-url';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';

export class CommandeUtileUrl extends DataUtileUrl {
    protected get _commandeUtile(): CommandeUtile { return this._parent as CommandeUtile; }

    /** ISiteRoutes de la page titre contenant l'outlet des détails */
    private _routesDétails: ISiteRoutes;

    private _texteKey: (détail: DetailCommande) => string;

    constructor(commandeUtile: CommandeUtile) {
        super(commandeUtile);
    }

    initialiseRouteDétail(parent: { client?: Client, produit?: Produit | LivraisonProduit }) {
        if (parent.produit) {
            this._routesDétails = LivraisonRoutes.produitRoutes(parent.produit.no);
            this._texteKey = (détail: DetailCommande) => détail ? KeyUidRno.texteDeKey(détail.client) : undefined;
        } else {
            this._texteKey = (détail: DetailCommande) => détail ? '' + détail.produit.no : undefined;
            this._routesDétails = !parent.client
                ? CommanderRoutes
                : LivraisonRoutes.commandeRoutes(parent.client);
        }
    }

    private _urlDefLivraison(pageDef: PageDef): IUrlDef {
        return this.__urlDef(LivraisonRoutes, pageDef);
    }

    private _urlDefCommande(pageDef: PageDef, commande: Commande): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(LivraisonRoutes, pageDef, KeyUidRno.texteDeKey(commande));
        return urlDef;
    }

    private _urlDefProduit(livraisonProduit: LivraisonProduit, détail?: DetailCommande): IUrlDef {
        const keys: string[] = ['' + livraisonProduit.no];
        if (détail) {
            keys.push(KeyUidRno.texteDeKey(détail.client));
        }
        const urlDef: IUrlDef = this._urlDefLivraison(LivraisonPages.produit);
        urlDef.keys = keys;
        return urlDef;
    }

    private _urlDefDétails(pageDef: PageDef, détail?: DetailCommande) {
        const urlDef: IUrlDef = this.__urlDef(this._routesDétails, pageDef, this._texteKey(détail));
        return urlDef;
    }

    private _urlDefRetourDétail(pageDef: PageDef, détail: DetailCommande) {
            const urlDef: IUrlDef = this.__urlDef(this._routesDétails, pageDef, this._texteKey(détail), true);
            return urlDef;
    }

    livraison(): IUrlDef {
        return this.__urlDef(LivraisonRoutes, LivraisonPages.commandes);
    }

    desClients(): IUrlDef {
        return this._urlDefLivraison(LivraisonPages.commandes);
    }
    retourDUnClient(commande: Commande): IUrlDef {
        const urlDef = this._urlDefLivraison(LivraisonPages.commandes);
        if (commande) {
            urlDef.fragment = this.id(KeyUidRno.texteDeKey(commande.client));
        }
        return urlDef;
    }

    choixClient(): IUrlDef {
        return this._urlDefLivraison(LivraisonPages.choixClient);
    }
    dUnClient(commande: Commande, aperçu?: boolean): IUrlDef {
        return this._urlDefCommande(aperçu ? LivraisonPages.apercu : LivraisonPages.commande, commande);
    }
    ajouteCommande(commande: Commande): IUrlDef {
        return this._urlDefCommande(LivraisonPages.commande, commande);
    }
    supprimeCommande(commande: Commande): IUrlDef {
        const urlDef = this._urlDefCommande(LivraisonPages.annule, commande);
        return urlDef;
    }

    desProduits(): IUrlDef {
        return this._urlDefLivraison(LivraisonPages.produits);
    }
    retourDUnProduit(livraisonProduit: LivraisonProduit): IUrlDef {
        const urlDef = this._urlDefLivraison(LivraisonPages.produits);
        urlDef.fragment = this.id('' + livraisonProduit.no);
        return urlDef;
    }
    dUnProduit(livraisonProduit: LivraisonProduit): IUrlDef {
        return this._urlDefProduit(livraisonProduit);
    }

    commande(): IUrlDef {
        return this._urlDefDétails(CommandePages.liste);
    }
    choixProduit(): IUrlDef {
        return this._urlDefDétails(CommandePages.choixProduit);
    }
    retourDeAjoute(détail: DetailCommande): IUrlDef {
        return this._urlDefRetourDétail(CommandePages.choixProduit, détail);
    }
    ajoute(détail: DetailCommande): IUrlDef {
        return this._urlDefDétails(CommandePages.ajoute, détail);
    }
    edite(détail: DetailCommande): IUrlDef {
        return this._urlDefDétails(CommandePages.edite, détail);
    }
    supprime(détail: DetailCommande): IUrlDef {
        return this._urlDefDétails(CommandePages.supprime, détail);
    }

    retourDétail(détail: DetailCommande): IUrlDef {
        return this._urlDefRetourDétail(CommandePages.liste, détail);
    }
}
