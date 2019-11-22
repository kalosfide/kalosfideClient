import { Commande } from 'src/app/commandes/commande';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { LivraisonProduit } from './livraison-produit';
import { LivraisonProduits } from './livraison-produits';
import { IDemandeCopiable } from 'src/app/commandes/i-demande-copiable';

export class GèreCopier {
    private _détails: IDemandeCopiable[];
    private _détailsCopiables: IDemandeCopiable[] = [];
    private _inactivitéIO: KfInitialObservable<boolean>;
    private _inactivitéIODétails: KfInitialObservable<boolean>[] = [];

    private constructor() {
    }

    static commande(commande: Commande): GèreCopier {
        const gèreCopier = new GèreCopier();
        gèreCopier._détails = commande.détails;
        return gèreCopier;
    }

    static livraisonProduit(livraisonProduit: LivraisonProduit): GèreCopier {
        const gèreCopier = new GèreCopier();
        gèreCopier._détails = livraisonProduit.détails;
        return gèreCopier;
    }

    static produits(livraisonProduits: LivraisonProduits): GèreCopier {
        const gèreCopier = new GèreCopier();
        gèreCopier._détails = livraisonProduits.produits;
        return gèreCopier;
    }

    get avecCopiables(): boolean {
        return this._détails.find(d => d.demandeCopiable) !== undefined;
    }

    get avecCopiablesPasPrêts(): boolean {
        return this._détails.find(d => d.demandeCopiable && !d.prêt) !== undefined;
    }

    get inactivitéIO(): KfInitialObservable<boolean> {
        if (!this._inactivitéIO) {
            this._inactivitéIO = KfInitialObservable.nouveau(!this.avecCopiablesPasPrêts);
        }
        return this._inactivitéIO;
    }
    inactivitéIODétail(détail: IDemandeCopiable): KfInitialObservable<boolean> {
        const index = this._détailsCopiables.indexOf(détail);
        let inactivitéIO: KfInitialObservable<boolean>;
        if (index === -1) {
            inactivitéIO = KfInitialObservable.nouveau(détail.prêt);
            this._détailsCopiables.push(détail);
            this._inactivitéIODétails.push(inactivitéIO);
        } else {
            inactivitéIO = this._inactivitéIODétails[index];
        }
        return inactivitéIO;
    }

    copie() {
        this._détailsCopiables.forEach(d => {
            const inactivitéIO = this.inactivitéIODétail(d);
            if (!inactivitéIO.valeur) {
                d.copieDemande();
                inactivitéIO.changeValeur(true);
            }
        });
        this._inactivitéIO.changeValeur(true);
    }
    copieDétail(détail: IDemandeCopiable) {
        détail.copieDemande();
        this.inactivitéIODétail(détail).changeValeur(true);
        this.inactivitéIO.changeValeur(!this.avecCopiablesPasPrêts);
    }
}
