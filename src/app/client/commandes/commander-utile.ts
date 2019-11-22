import { CommandeService } from 'src/app/commandes/commande.service';
import { CommandeUtile } from 'src/app/commandes/commande-utile';
import { CommandeUtileBouton } from 'src/app/commandes/commande-utile-bouton';
import { CommandeUtileColonne } from 'src/app/commandes/commande-utile-colonne';

export class CommanderUtile extends CommandeUtile {

    constructor(service: CommandeService) {
        super(service);
        this._bouton = new CommandeUtileBouton(this);
        this._colonne = new CommandeUtileColonne(this);
        this.colonne.créeDétail();
    }

    get bouton(): CommandeUtileBouton {
        return this._bouton as CommandeUtileBouton;
    }

    get colonne(): CommandeUtileColonne {
        return this._colonne as CommandeUtileColonne;
    }
}
