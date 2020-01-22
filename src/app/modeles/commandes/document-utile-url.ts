import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ISiteRoutes, SiteRoutes } from 'src/app/site/site-pages';
import { DocumentUtile } from './document-utile';
import { Client } from '../client/client';
import { Produit } from '../catalogue/produit';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { DocCLF } from './document';
import { LigneDocument } from './ligne-base';
import { LivraisonRoutes, LivraisonPages } from 'src/app/fournisseur/livraisons/livraison-pages';
import { CommanderRoutes } from 'src/app/client/commandes/commander-pages';
import { CommandePages } from 'src/app/commandes/commande-pages';

export class DocumentUtileUrl extends DataUtileUrl {
    protected get _utile(): DocumentUtile { return this._parent as DocumentUtile; }

    /** ISiteRoutes de la page titre contenant l'outlet des détails */
    private _routesDétails: ISiteRoutes;

    private _texteKey: (détail: LigneDocument) => string;

    constructor(utile: DocumentUtile) {
        super(utile);
    }

    initialiseRouteDétail(parent: { client?: Client, produit?: Produit }) {
        if (parent.produit) {
            this._routesDétails = LivraisonRoutes.produitRoutes(parent.produit.no);
            this._texteKey = (détail: LigneDocument) => détail ? KeyUidRno.texteDeKey(détail.client) : undefined;
        } else {
            this._texteKey = (détail: LigneDocument) => détail ? '' + détail.produit.no : undefined;
            this._routesDétails = !parent.client
                ? CommanderRoutes
                : LivraisonRoutes.commandeRoutes(parent.client);
        }
    }

    private _urlDefLivraison(pageDef: PageDef): IUrlDef {
        return this.__urlDef(LivraisonRoutes, pageDef);
    }

    private _urlDefCommande(pageDef: PageDef, commande: DocCLF): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(LivraisonRoutes, pageDef, KeyUidRno.texteDeKey(commande));
        return urlDef;
    }

    private _urlDefDétails(pageDef: PageDef, détail?: LigneDocument) {
        const urlDef: IUrlDef = this.__urlDef(this._routesDétails, pageDef, this._texteKey(détail));
        return urlDef;
    }

    private _urlDefRetourDétail(pageDef: PageDef, détail: LigneDocument) {
            const urlDef: IUrlDef = this.__urlDef(this._routesDétails, pageDef, this._texteKey(détail), true);
            return urlDef;
    }

    livraison(): IUrlDef {
        return this.__urlDef(LivraisonRoutes, LivraisonPages.commandes);
    }

    desClients(): IUrlDef {
        return this._urlDefLivraison(LivraisonPages.commandes);
    }
    retourDUnClient(commande: DocCLF): IUrlDef {
        const urlDef = this._urlDefLivraison(LivraisonPages.commandes);
        if (commande) {
            urlDef.fragment = this.id(KeyUidRno.texteDeKey(commande.client));
        }
        return urlDef;
    }

    choixClient(): IUrlDef {
        return this._urlDefLivraison(LivraisonPages.choixClient);
    }
    dUnClient(commande: DocCLF, aperçu?: boolean): IUrlDef {
        return this._urlDefCommande(aperçu ? LivraisonPages.apercu : LivraisonPages.commande, commande);
    }
    ajouteCommande(commande: DocCLF): IUrlDef {
        return this._urlDefCommande(LivraisonPages.commande, commande);
    }
    supprimeCommande(commande: DocCLF): IUrlDef {
        const urlDef = this._urlDefCommande(LivraisonPages.annule, commande);
        return urlDef;
    }

    commande(): IUrlDef {
        return this._urlDefDétails(CommandePages.liste);
    }
    choixProduit(): IUrlDef {
        return this._urlDefDétails(CommandePages.choixProduit);
    }
    retourDeAjoute(détail: LigneDocument): IUrlDef {
        return this._urlDefRetourDétail(CommandePages.choixProduit, détail);
    }
    ajoute(détail: LigneDocument): IUrlDef {
        return this._urlDefDétails(CommandePages.ajoute, détail);
    }
    edite(détail: LigneDocument): IUrlDef {
        return this._urlDefDétails(CommandePages.edite, détail);
    }
    supprime(détail: LigneDocument): IUrlDef {
        return this._urlDefDétails(CommandePages.supprime, détail);
    }

    retourDétail(détail: LigneDocument): IUrlDef {
        return this._urlDefRetourDétail(CommandePages.liste, détail);
    }
}
