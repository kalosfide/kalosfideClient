import { ProduitUtile } from './produit-utile';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Produit } from './produit';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ProduitUtileLien extends DataUtileLien {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }

    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Produit): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }
    edite(t: Produit): KfLien {
        return this.utile.lienKey.edite(t);
    }
    supprime(t: Produit): KfLien {
        return this.utile.lienKey.supprime(t);
    }

    prix(t: Produit): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.prix(t), Fabrique.contenu.prix));
    }

}
