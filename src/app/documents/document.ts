import { Client } from '../modeles/client/client';
import { Produit } from '../modeles/catalogue/produit';

export interface IDocument {
    client: Client;
    no: number;
    key?: string;
    code: string;
    date: Date;
    nbLignes: number;
    total: number;

    titre: string;
    àOuDe: string;
    lignes: IDocumentLigne[];
    texteVide: string;
}

export interface IDocumentLigne {
    produit: Produit;
}
