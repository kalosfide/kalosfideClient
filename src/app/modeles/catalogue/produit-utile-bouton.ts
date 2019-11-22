import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { ProduitUtile } from './produit-utile';
import { ProduitUtileUrl } from './produit-utile-url';
import { ProduitUtileLien } from './produit-utile-lien';

export class ProduitUtileBouton extends DataUtileBouton {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._dataUtile as ProduitUtile;
    }

    get url(): ProduitUtileUrl {
        return this.utile.url;
    }

    get lien(): ProduitUtileLien {
        return this.utile.lien;
    }

}
