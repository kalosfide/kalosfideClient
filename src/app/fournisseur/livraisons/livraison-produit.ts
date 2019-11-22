import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { IdTypeCommande, TypeCommande } from 'src/app/modeles/type-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Client } from 'src/app/modeles/clientele/client';
import { compareKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { LivraisonStock } from './livraison-stock';
import { EtatCommande } from 'src/app/commandes/etat-commande';
import { IDemandeCopiable } from 'src/app/commandes/i-demande-copiable';
import { IAvecDemandeProduit } from 'src/app/commandes/i-avec-demande-produit';

export class LivraisonProduit implements IKeyUidRnoNo, IDemandeCopiable, IAvecDemandeProduit {

    private _stock: LivraisonStock;
    get stock(): LivraisonStock { return this._stock; }

    livraisonNo: number;
    produit: Produit;
    détails: DetailCommande[];

    private _superGroupe: KfSuperGroupe;

    constructor(
        stock: LivraisonStock,
        clients: Client[],
        produit: Produit,
    ) {
        this._stock = stock;
        this.produit = produit;
        this.détails = [];
        stock.apiCommandesATraiter.forEach((apiCommande: ApiCommande) => {
            const client = clients.find(c => compareKeyUidRno(c, apiCommande));
            apiCommande.details.forEach(d => {
                if (d.no === produit.no) {
                    const détail: DetailCommande = new DetailCommande(apiCommande, produit, {
                        client: client,
                        étatSiteLivraison: true,
                        estDansListeParProduit: true,
                    });
                    this.détails.push(détail);
                }
            });
        });
        this.livraisonNo = stock.livraisonNo;
    }

    get uid(): string { return this.produit.uid; }
    get rno(): number { return this.produit.rno; }
    get no(): number { return this.produit.no; }

    get nbDemandes(): number {
        return this.détails.length;
    }
    get nbRéponses(): number {
        return this.détails.filter(l => l.aLivrer !== undefined && l.aLivrer !== null).length;
    }
    get nbRefus(): number {
        return this.détails.filter(l => l.aLivrer === 0).length;
    }
    get prêt(): boolean {
        return this.nbDemandes === this.nbRéponses;
    }

    get demande(): number {
        let total = 0;
        this.détails.forEach(d => {
            if (d.demande && d.demandeCopiable) {
                total += d.demande;
            }
        });
        return total;
    }

    get aLivrer(): number {
        let total = 0;
        this.détails.forEach(d => {
            if (d.aLivrer) {
                total += d.aLivrer;
            }
        });
        return total;
    }

    get texteEtat(): string {
        const def = this.prêt ? EtatCommande.prêt
            : EtatCommande.incomplet;
        return def.texte;
    }

    get demandeCopiable(): boolean {
        if (this.produit.typeCommande !== IdTypeCommande.ALUnitéOuEnVrac) {
            return true;
        }
        return this.détails.find(d => d.demandeCopiable) !== undefined;
    }

    copieDemande() {
        this.détails.forEach(d => d.copieDemande());
    }


    copiablesOuNon(): {
        copiables: DetailCommande[],
        nonCopiables: DetailCommande[],
    } {
        const copiablesOuNon: {
            copiables: DetailCommande[],
            nonCopiables: DetailCommande[],
        } = { copiables: [], nonCopiables: [] };
        this.détails.forEach(d => {
            if (d.produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac && d.typeCommande === IdTypeCommande.ALUnité) {
                copiablesOuNon.nonCopiables.push(d);
            } else {
                copiablesOuNon.copiables.push(d);
            }
        });
        return copiablesOuNon;
    }

    protected _créeSuperGroupe() {
        const superGroupe = new KfSuperGroupe('' + this.uid);
        superGroupe.créeGereValeur();
        superGroupe.estRacineV = true;
        const uid = Fabrique.input.nombre('uid');
        uid.valeur = this.no;
        uid.visible = false;
        superGroupe.ajoute(uid);
        const rno = Fabrique.input.nombre('rno');
        rno.valeur = this.rno;
        rno.visible = false;
        superGroupe.ajoute(rno);
        const no = Fabrique.input.nombre('no');
        no.valeur = this.no;
        no.visible = false;
        superGroupe.ajoute(no);

        superGroupe.quandTousAjoutés();
        this._superGroupe = superGroupe;
    }

    get superGroupe(): KfSuperGroupe {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return this._superGroupe;
    }

}
