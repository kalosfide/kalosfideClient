import { ProduitService } from './produit.service';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { Produit } from './produit';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { ProduitRoutes, ProduitPages } from 'src/app/fournisseur/produits/produit-pages';
import { ProduitUtileUrl } from './produit-utile-url';
import { ProduitUtileLien } from './produit-utile-lien';
import { TypeMesure } from '../type-mesure';
import { TypeCommande } from '../type-commande';
import { EtatsProduits } from './etat-produit';
import { ProduitUtileColonne } from './produit-utile-colonne';
import { ProduitUtileBouton } from './produit-utile-bouton';
import { ProduitUtileOutils } from './produit-utile-outils';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';

export class ProduitUtile extends DataKeyUtile<Produit> {
    constructor(service: ProduitService) {
        super(service);
        this.dataRoutes = ProduitRoutes;
        this.dataPages = ProduitPages;
        this._url = new ProduitUtileUrl(this);
        this._lien = new ProduitUtileLien(this);
        this._bouton = new ProduitUtileBouton(this);
        this._outils = new ProduitUtileOutils(this);
        this._colonne = new ProduitUtileColonne(this);
        this._urlKey = new DataKeyUtileUrl(this);
        this._lienKey = new DataKeyUtileLien(this);
        this._colonneKey = new DataKeyUtileColonne(this);
        this._outilsKey = new DataKeyUtileOutils(this);
    }

    get url(): ProduitUtileUrl {
        return this._url as ProduitUtileUrl;
    }

    get lien(): ProduitUtileLien {
        return this._lien as ProduitUtileLien;
    }

    get bouton(): ProduitUtileBouton {
        return this._bouton as ProduitUtileBouton;
    }

    get outils(): ProduitUtileOutils {
        return this._outils as ProduitUtileOutils;
    }

    get colonne(): ProduitUtileColonne {
        return this._colonne as ProduitUtileColonne;
    }
}
