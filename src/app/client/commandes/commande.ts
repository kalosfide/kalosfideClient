import { KeyUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { CommandeLigne, CommandeDetail } from './commande-ligne';
import { Produit } from 'src/app/modeles/produit';

export class Commande extends KeyUidRnoNo {
    livraisonNo?: number;
    date: Date;
    details: CommandeDetail[];
    etat: string;
}

export class CommandeVue extends KeyUidRnoNo {
    livraisonNo?: number;
    date: Date;
    lignes: CommandeLigne[];
    produits: Produit[];
    etat: string;

    constructor(derniere: Commande, produits: Produit[]) {
        super();
        this.uid = derniere.uid;
        this.rno = derniere.rno;
        this.no = derniere.no;
        this.date = new Date(derniere.date);
        this.livraisonNo = derniere.livraisonNo;
        this.etat = derniere.etat;
        this.lignes = produits.map(p => {
            return new CommandeLigne(p, derniere);
        });
        this.produits = produits;
    }

    get inchangé(): boolean {
        return this.lignes.find(l => l.changé) === undefined;
    }
}
