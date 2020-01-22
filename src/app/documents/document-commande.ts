import { Commande } from '../commandes/commande';
import { ApiDocumentCommande } from './document-api';
import { Client } from '../modeles/client/client';
import { IDocument } from './document';
import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { DocumentDétail } from './document-detail';
import { Catalogue } from '../modeles/catalogue/catalogue';

export class DocumentCommandeBase extends Commande {
    constructor(apiCommande: ApiDocumentCommande, client: Client) {
        super(apiCommande, client);
        const tarif = Catalogue.nouveau(apiCommande.catalogue);
        this._détails = apiCommande.details.map(d => {
            const produit = tarif.produits.find(p => p.no === d.no);
            return new DocumentDétail(apiCommande, produit);
        });
}

    get apiCommande(): ApiDocumentCommande {
        return this._apiCommande as ApiDocumentCommande;
    }

    get key(): string {
        return KeyUidRnoNo.texteDeKey(this.apiCommande);
    }

    get lignes(): DocumentDétail[] {
        return this._détails;
    }
}

export class DocumentCommande extends DocumentCommandeBase implements IDocument {
    constructor(apiCommande: ApiDocumentCommande, client: Client) {
        super(apiCommande, client);
    }

    get code(): string {
        return this.texteBonDeCommande;
    }
    get nbLignes(): number {
        return this.apiCommande.lignesC;
    }
    get total(): number {
        return this.apiCommande.totalC;
    }

    get titre(): string {
        return 'Bon de commande ' + this.key;
    }

    get àOuDe(): string {
        return 'De ';
    }

    get texteVide(): string {
        return 'Il n\'a pas de bons de commande.';
    }
}

export class DocumentLivraison extends DocumentCommandeBase implements IDocument {
    constructor(apiCommande: ApiDocumentCommande, client: Client) {
        super(apiCommande, client);
    }

    get date(): Date {
        return new Date(this.apiCommande.dateLivraison);
    }

    get code(): string {
        return this.texteBonDeLivraison;
    }
    get nbLignes(): number {
        return this.apiCommande.lignesL;
    }
    get total(): number {
        return this.apiCommande.totalL;
    }

    get titre(): string {
        return 'Bon de livraison ' + this.key;
    }

    get àOuDe(): string {
        return 'A ';
    }

    get texteVide(): string {
        return 'Il n\'a pas de bons de livraison.';
    }
}
