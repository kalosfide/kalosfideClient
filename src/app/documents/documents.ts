import { IDocument } from './document';
import { ApiDocumentCommande, ApiDocumentFacture } from './document-api';
import { DocumentCommande, DocumentLivraison } from './document-commande';
import { Client } from '../modeles/client/client';
import { DocumentFacture } from './document-facture';

export class Documents {
    documents: IDocument[];

    constructor(apiCommandes: ApiDocumentCommande[], apiFactures: ApiDocumentFacture[], clients: Client[]) {
        this.documents = [];
        apiCommandes.forEach(apiCommande => {
            const client = clients.find(c => c.uid === apiCommande.uid && c.rno === apiCommande.rno);
            if (apiCommande.lignesC) {
                this.documents.push(new DocumentCommande(apiCommande, client));
            }
            if (apiCommande.lignesL) {
                this.documents.push(new DocumentLivraison(apiCommande, client));
            }
        });
        apiFactures.forEach(apiFacture => {
            const client = clients.find(c => c.uid === apiFacture.uid && c.rno === apiFacture.rno);
            this.documents.push(new DocumentFacture(apiFacture, client));
        });
    }
}
