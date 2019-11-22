import { FactureService } from './facture.service';
import { FactureUtileUrl } from './facture-utile-url';
import { FactureUtileLien } from './facture-utile-lien';
import { FactureUtileOutils } from './facture-utile-outils';
import { CommandeUtile } from 'src/app/commandes/commande-utile';
import { FactureUtileColonne } from './facture-utile-colonne';
import { FactureUtileBouton } from './facture-utile-bouton';

export class FactureUtile extends CommandeUtile {

    constructor(service: FactureService) {
        super(service);
        this._url = new FactureUtileUrl(this);
        this._lien = new FactureUtileLien(this);
        this._outils = new FactureUtileOutils(this);
        this._bouton = new FactureUtileBouton(this);
        this._colonne = new FactureUtileColonne(this);
    }

    get service(): FactureService {
        return this._service as FactureService;
    }

    get url(): FactureUtileUrl {
        return this._url as FactureUtileUrl;
    }

    get lien(): FactureUtileLien {
        return this._lien as FactureUtileLien;
    }

    get outils(): FactureUtileOutils {
        return this._outils as FactureUtileOutils;
    }

    get bouton(): FactureUtileBouton {
        return this._bouton as FactureUtileBouton;
    }

    get colonne(): FactureUtileColonne {
        return this._colonne as FactureUtileColonne;
    }

    texte = {
        définition_Commander: `Commander consiste à choisir des produits et à fixer les quantités demandées.`,
        définition_Traiter: `Traiter une commande consiste à fixer la quantité à livrer de chaque produit demandé.`,
        titre: 'Livraison',
        titre_Vérifier: 'Vérifier',
        titre_AnnulerVérifier: 'Reprendre',
        titre_Terminer: 'Valider',
    };

}
