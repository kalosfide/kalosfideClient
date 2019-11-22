import { FactureUtileUrl } from './facture-utile-url';
import { FactureUtileLien } from './facture-utile-lien';
import { FactureUtile } from './facture-utile';
import { CommandeUtileOutils } from 'src/app/commandes/commande-utile-outils';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FactureCommande } from './facture-commande';
import { Facture } from './facture';

export class FactureUtileOutils extends CommandeUtileOutils {
    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
    }

    get factureUtile(): FactureUtile {
        return this._dataUtile as FactureUtile;
    }

    get urlUtile(): FactureUtileUrl {
        return this.factureUtile.url;
    }

    get lienUtile(): FactureUtileLien {
        return this.factureUtile.lien;
    }

    get nomOutil(): {
        client: string,
        catégorie: string,
        produit: string,
        préparation: string,
    } {
        return {
            client: 'client',
            produit: 'produit',
            catégorie: 'catégorie',
            préparation: 'préparation',
        };
    }

    factureClient(): KfVueTableFiltreCherche<Facture> {
        return Fabrique.vueTable.cherche<Facture>(this.nomOutil.client, 'Client',
            (facture: Facture) => facture.client.nom, 'Rechercher un client');
    }

}
