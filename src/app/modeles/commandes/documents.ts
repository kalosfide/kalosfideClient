import { ApiDocument } from './api-document';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Catalogue } from '../catalogue/catalogue';
import { Client } from '../client/client';
import { ApiDocumentsData } from './api-documents-client-data';
import { LigneDocument } from './ligne-base';
import { DocCLF, TypeDocument } from './document';
import { Produit } from '../catalogue/produit';

/**
 * Contient des documents
 * Objet stocké
 */
export class Documents {
    /**
     * Type du document à éditer
     */
    type: TypeDocument;
    /**
     * Présent quand les documents sont chargés pour être stockés.
     * key de l'identifiant en cours à la création du stock
     * comparé à l'identifiant en cours à chaque lecture du stock pour recharger le stock si changé
     */
    keyIdentifiant: IKeyUidRno;

    /**
     * Présent quand les documents sont chargés pour être stockés.
     * key du site en cours à la création du stock
     * comparé au Site en cours à chaque lecture du stock pour recharger le stock si changé
     */
    keySite: IKeyUidRno;

    /**
     * Présent quand les documents sont chargés pour une édition.
     */
    catalogue: Catalogue;

    /**
     * Présent quand les documents sont chargés pour une édition ou une vue.
     */
    client: Client;

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    clients: Client[];

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    apiCommandes: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    apiLivraisons: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une liste.
     */
    apiFactures: ApiDocument[];

    /**
     * Présent quand les documents sont chargés pour une édition ou une vue.
     * Pour une vue, contient seulement le document à visualiser.
     * Quand un client va créer ou éditer une commande, contient seulement la dernière commande non refusée.
     * Quand le fournisseur va créer ou éditer le bon de livraison d'un client, contient les commandes de ce client
     * avec date et sans numéro de livraison (il peut y en avoir plusieurs) ou s'il n'y en a pas, la dernière livraison.
     * Quand le fournisseur va créer ou éditer la facture d'un client, contient les livraisons de ce client
     * avec date sans numéro de facture
     */
    apiDocuments: ApiDocument[];

    /**
     * Présent quand le fournisseur est en train d'éditer le bon de livraison ou la facture d'un client pour stocker les données éditées.
     */
    apiSynthèse?: ApiDocument;

    copie(stocké: Documents) {
        this.type = stocké.type;
        this.keyIdentifiant = stocké.keyIdentifiant;
        this.keySite = stocké.keySite;
        this.client = stocké.client;
        this.catalogue = stocké.catalogue;
        this.apiCommandes = stocké.apiCommandes;
        this.apiLivraisons = stocké.apiLivraisons;
        this.apiFactures = stocké.apiFactures;
        this.apiDocuments = stocké.apiDocuments;
    }

    charge(datas: ApiDocumentsData) {
        this.apiCommandes = datas.commandes;
        this.apiLivraisons = datas.livraisons;
        this.apiFactures = datas.factures;
        this.apiDocuments = datas.documents;
    }

    initialise(type: TypeDocument, keyIdentifiant: IKeyUidRno, keySite: IKeyUidRno) {
        this.type = type;
        this.keyIdentifiant = keyIdentifiant;
        this.keySite = keySite;
    }

    get keyClient(): IKeyUidRno { return this.client ? this.client : this.keyIdentifiant; }

    /**
     * Pour édition. L'utilisateur est le client.
     */
    private créeDocSansLignes(type: TypeDocument, apiDoc: ApiDocument, keyClient: IKeyUidRno): DocCLF {
        const document = new DocCLF(this, type);
        document.apiDoc = apiDoc;
        document.type = type;
        document.apiDoc.uid = keyClient.uid;
        document.apiDoc.rno = keyClient.rno;
        return document;
    }
    créeCommande(): DocCLF {
        const commande = this.créeDocSansLignes('commande', this.apiDocuments[0], this.keyIdentifiant);
        commande.créeLignes();
        return commande;
    }
    créeLigneCommande(no: number): LigneDocument {
        const commande = this.créeDocSansLignes('commande', this.apiDocuments[0], this.keyIdentifiant);
        const ligne = commande.créeLigne(no);
        return ligne;
    }

    /**
     * Pour la vue. L'utilisateur est le client ou le fournisseur.
     */
    créeDocumentVue(type: TypeDocument): DocCLF {
        const commande = this.créeDocSansLignes(type, this.apiDocuments[0], this.client);
        commande.créeLignes();
        return commande;
    }

    créeDocumentSynthèse(): DocCLF {
        const synthèse = this.créeDocSansLignes(this.type, new ApiDocument(), this.client);
        const typeASynthétiser = this.type === 'livraison' ? 'commande' : this.type === 'facture' ? 'livraison' : undefined;
        synthèse.àSynthétiser = this.apiDocuments.map(apiDoc => {
            const document = this.créeDocSansLignes(typeASynthétiser, apiDoc, this.client);
            document.synthèse = synthèse;
            return document;
        });
        return synthèse;
    }

    filtreASynthétiser(synthèse: DocCLF) {
        const àSynthétiser = synthèse.àSynthétiser.filter(doc => !!doc.synthèse);
        this.apiDocuments.filter(apiDoc => àSynthétiser.find(doc => doc.no === apiDoc.no));
    }

    créeLivraison() {}

}

