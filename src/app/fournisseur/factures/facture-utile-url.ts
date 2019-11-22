import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { FactureUtile } from './facture-utile';
import { CommandeUtileUrl } from 'src/app/commandes/commande-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { FactureRoutes, FacturePages } from './facture-pages';
import { texteKeyUidRno, texteKeyUidRnoNo } from 'src/app/commun/data-par-key/data-key';
import { Facture } from './facture';
import { FactureCommande } from './facture-commande';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';

export class FactureUtileUrl extends CommandeUtileUrl {

    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
    }

    factures(): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.clients);
    }
    facture(facture: IKeyUidRno): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.client, texteKeyUidRno(facture));
    }
    retourDUneFacture(facture: IKeyUidRno): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.clients, texteKeyUidRno(facture), true);
    }
    factureCommande(factureCommande: FactureCommande): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, texteKeyUidRno(factureCommande.client));
        urlDef.keys.push(FacturePages.commande.urlSegment, '' + factureCommande.no);
        return urlDef;
    }
    retourDeFactureCommande(factureCommande: FactureCommande): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, texteKeyUidRno(factureCommande.client));
        urlDef.fragment = '' + factureCommande.no;
        return urlDef;
    }
    envoiFacture(facture: IKeyUidRno) {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, texteKeyUidRno(facture));
        urlDef.keys.push(FacturePages.facture.urlSegment);
        return urlDef;
    }
}
