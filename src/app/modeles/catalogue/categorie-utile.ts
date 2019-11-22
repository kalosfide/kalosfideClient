import { CategorieService } from './categorie.service';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { Categorie } from './categorie';
import { CategorieRoutes, CategoriePages } from 'src/app/fournisseur/produits/categories/categorie-pages';
import { DataKeyUtileUrl } from 'src/app/commun/data-par-key/data-key-utile-url';
import { DataKeyUtileLien } from 'src/app/commun/data-par-key/data-key-utile-lien';
import { CategorieUtileUrl } from './categorie-utile-url';
import { CategorieUtileLien } from './categorie-utile-lien';
import { CategorieUtileBouton } from './categorie-utile-bouton';
import { CategorieUtileOutils } from './categorie-utile-outils';
import { DataKeyUtileColonne } from 'src/app/commun/data-par-key/data-key-utile-colonne';
import { CategorieUtileColonne } from './categorie-utile-colonne';
import { DataKeyUtileOutils } from 'src/app/commun/data-par-key/data-key-utile-outils';

export class CategorieUtile extends DataKeyUtile<Categorie> {
    constructor(service: CategorieService) {
        super(service);
        this.dataRoutes = CategorieRoutes;
        this.dataPages = CategoriePages;
        this._url = new CategorieUtileUrl(this);
        this._lien = new CategorieUtileLien(this);
        this._bouton = new CategorieUtileBouton(this);
        this._outils = new CategorieUtileOutils(this);
        this._colonne = new CategorieUtileColonne(this);
        this._urlKey = new DataKeyUtileUrl(this);
        this._lienKey = new DataKeyUtileLien(this);
        this._colonneKey = new DataKeyUtileColonne(this);
        this._outilsKey = new DataKeyUtileOutils(this);
    }

    get url(): CategorieUtileUrl {
        return this._url as CategorieUtileUrl;
    }

    get lien(): CategorieUtileLien {
        return this._lien as CategorieUtileLien;
    }

    get bouton(): CategorieUtileBouton {
        return this._bouton as CategorieUtileBouton;
    }

    get outils(): CategorieUtileOutils {
        return this._outils as CategorieUtileOutils;
    }

    get colonne(): CategorieUtileColonne {
        return this._colonne as CategorieUtileColonne;
    }
}
