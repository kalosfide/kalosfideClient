import { FactureUtile } from './facture-utile';
import { CommandeUtileUrl } from 'src/app/commandes/commande-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { FactureRoutes, FacturePages } from './facture-pages';
import { FactureCommande } from './facture-commande';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

export class FactureUtileUrl extends CommandeUtileUrl {

    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
    }

    factures(): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.clients);
    }
    facture(facture: IKeyUidRno): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.client, KeyUidRno.texteDeKey(facture));
    }
    retourDUneFacture(facture: IKeyUidRno): IUrlDef {
        return this.__urlDef(FactureRoutes, FacturePages.clients, KeyUidRno.texteDeKey(facture), true);
    }
    factureCommande(factureCommande: FactureCommande): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, KeyUidRno.texteDeKey(factureCommande.client));
        urlDef.keys.push(FacturePages.commande.urlSegment, '' + factureCommande.no);
        return urlDef;
    }
    retourDeFactureCommande(factureCommande: FactureCommande): IUrlDef {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, KeyUidRno.texteDeKey(factureCommande.client));
        urlDef.fragment = '' + factureCommande.no;
        return urlDef;
    }
    envoiFacture(facture: IKeyUidRno) {
        const urlDef: IUrlDef = this.__urlDef(FactureRoutes, FacturePages.client, KeyUidRno.texteDeKey(facture));
        urlDef.keys.push(FacturePages.facture.urlSegment);
        return urlDef;
    }
}
