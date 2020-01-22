import { DocumentService } from './document.service';
import { DocumentUtile } from './document-utile';
import { DataUtileColonne } from '../commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from '../commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { IDocument } from './document';
import { Tri } from '../commun/outils/trieur';
import { Compare } from '../modeles/compare';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { DocumentUtileLien } from './document-utile-lien';
import { IAvecProduit } from '../modeles/catalogue/produit';
import { TypeMesure } from '../modeles/type-mesure';
import { DocumentDétail } from './document-detail';
import { CoûtDef, DetailCommandeCoût } from '../commandes/detail-commande-cout';
import { DocumentProduit } from './document-produit';

export class DocumentUtileColonne extends DataUtileColonne {
    constructor(utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this.dataUtile as DocumentUtile;
    }

    get service(): DocumentService {
        return this.utile.service;
    }

    get lien(): DocumentUtileLien {
        return this.utile.lien;
    }

    client(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'client',
            créeContenu: (document: IDocument) => document.client.nom,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<IDocument>('client',
                (d1: IDocument, d2: IDocument): number => Compare.AvecClient_nomClient(d1, d2)),
        };
    }

    code(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'code',
            créeContenu: (document: IDocument) => document.code,
            enTeteDef: { titreDef: 'Code' },
        };
    }

    date(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'date',
            créeContenu: (document: IDocument) => Fabrique.texte.date(document.date),
            enTeteDef: { titreDef: 'Code' },
        };
    }

    lignes(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'lignes',
            créeContenu: (document: IDocument) => '' + document.nbLignes,
            enTeteDef: { titreDef: 'Nombre de lignes' },
        };
    }

    montant(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'montant',
            créeContenu: (document: IDocument) => Fabrique.texte.prix(document.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

    choisit(): IKfVueTableColonneDef<IDocument> {
        return {
            nom: 'choisit',
            créeContenu: (document: IDocument) => ({ composant: this.lien.document(document) }),
        };
    }

    documents(estClient: boolean): IKfVueTableColonneDef<IDocument>[] {
        const defs = [
            this.client(),
            this.code(),
            this.lignes(),
            this.montant(),
            this.choisit(),
        ];
        return estClient ? defs : [this.client()].concat(defs);
    }

    catégorie<T extends IAvecProduit>(): IKfVueTableColonneDef<T> {
        return {
            nom: 'catégorie',
            créeContenu: (t: T) => Fabrique.texte.nomCatégorie(t),
            enTeteDef: { titreDef: 'Catégorie' },
        };
    }

    produit<T extends IAvecProduit>(): IKfVueTableColonneDef<T> {
        return {
            nom: 'produit',
            créeContenu: (t: T) => Fabrique.texte.nomProduit(t),
            enTeteDef: { titreDef: 'Produit' },
            bilanDef: {
                titreDef: 'Total',
                titreVisiblesSeulement: 'Affichés',
                valeurDef: '',
                texteAgrégé: (ts: T[]) => '' + ts.length,
            }
        };
    }

    prix<T extends IAvecProduit>(): IKfVueTableColonneDef<T> {
        return {
            nom: 'prix',
            créeContenu: (t: T) => Fabrique.texte.avecProduit_prix(t),
            enTeteDef: { titreDef: 'Prix' },
        };
    }

    typeMesure<T extends IAvecProduit>(): IKfVueTableColonneDef<T> {
        return {
            nom: 'typeMesure',
            créeContenu: (t: T) => TypeMesure.texteUnités(t.produit.typeMesure, t.produit.typeCommande),
            enTeteDef: { titreDef: 'Unité' },
        };
    }

    demandé(): IKfVueTableColonneDef<DocumentDétail> {
        return {
            nom: 'demandé',
            créeContenu: (détail: DocumentDétail) => Fabrique.texte.nombre(détail.demande),
            enTeteDef: { titreDef: 'Quantité' },
        };
    }

    typeCommande(): IKfVueTableColonneDef<DocumentDétail> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: DocumentDétail) => Fabrique.texte.avecProduit_unités(détail, détail.typeCommande),
            enTeteDef: { titreDef: 'Unité' },
        };
    }

    livré(): IKfVueTableColonneDef<DocumentDétail> {
        return {
            nom: 'livré',
            créeContenu: (détail: DocumentDétail) => Fabrique.texte.nombre(détail.aLivrer),
            enTeteDef: { titreDef: 'Quantité' },
        };
    }

    facturé(): IKfVueTableColonneDef<DocumentProduit> {
        return {
            nom: 'facturé',
            créeContenu: (détail: DocumentProduit) => Fabrique.texte.nombre(détail.quantité),
            enTeteDef: { titreDef: 'Quantité' },
        };
    }

    coût<T>(coûtDef: CoûtDef<T>): IKfVueTableColonneDef<T> {
        return {
            nom: 'coût',
            créeContenu: (détail: T) => {
                return ({ texteDef: () => coûtDef.texte(détail) });
            },
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                valeurDef: '',
                texteAgrégé: (détails: T[]) => coûtDef.texteAgrégé(détails),
            }
        };
    }

    commande(date: Date): IKfVueTableColonneDef<DocumentDétail>[] {
        return [
            this.catégorie<DocumentDétail>(),
            this.produit<DocumentDétail>(),
            this.prix<DocumentDétail>(),
            this.typeMesure<DocumentDétail>(),
            this.demandé(),
            this.typeCommande(),
            this.coût(DetailCommandeCoût.demande(date))
        ];
    }

    livraison(date: Date): IKfVueTableColonneDef<DocumentDétail>[] {
        return [
            this.catégorie<DocumentDétail>(),
            this.produit<DocumentDétail>(),
            this.prix<DocumentDétail>(),
            this.typeMesure<DocumentDétail>(),
            this.livré(),
            this.coût(DetailCommandeCoût.aLivrer(date))
        ];
    }

    facture(): IKfVueTableColonneDef<DocumentProduit>[] {
        return [
            this.catégorie<DocumentProduit>(),
            this.produit<DocumentProduit>(),
            this.prix<DocumentProduit>(),
            this.typeMesure<DocumentProduit>(),
            this.facturé(),
            this.coût(new CoûtDef<DocumentProduit>((dp: DocumentProduit) => dp.coût))
        ];
    }

}

