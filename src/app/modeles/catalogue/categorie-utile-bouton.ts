import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { CategorieUtile } from './categorie-utile';
import { CategorieUtileUrl } from './categorie-utile-url';
import { CategorieUtileLien } from './categorie-utile-lien';

export class CategorieUtileBouton extends DataUtileBouton {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._dataUtile as CategorieUtile;
    }

    get url(): CategorieUtileUrl {
        return this.utile.url;
    }

    get lien(): CategorieUtileLien {
        return this.utile.lien;
    }

}
