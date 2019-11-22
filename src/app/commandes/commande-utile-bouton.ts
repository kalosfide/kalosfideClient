import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtile } from './commande-utile';
import { DataUtileBouton } from '../commun/data-par-key/data-utile-bouton';

export class CommandeUtileBouton extends DataUtileBouton {
    constructor(commandeUtile: CommandeUtile) {
        super(commandeUtile);
    }

    get commandeUtile(): CommandeUtile {
        return this._dataUtile as CommandeUtile;
    }

    get url(): CommandeUtileUrl {
        return this.commandeUtile.url;
    }

    get lien(): CommandeUtileLien {
        return this.commandeUtile.lien;
    }

}
