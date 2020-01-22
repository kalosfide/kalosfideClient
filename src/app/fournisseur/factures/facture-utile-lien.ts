import { FactureUtile } from './facture-utile';
import { FactureUtileUrl } from './facture-utile-url';
import { CommandeUtileLien } from 'src/app/commandes/commande-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Facture } from './facture';
import { FactureCommande } from './facture-commande';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Client } from 'src/app/modeles/client/client';

export class FactureUtileLien extends CommandeUtileLien {

    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
    }

    get factureUtile(): FactureUtile {
        return this._parent as FactureUtile;
    }

    get url(): FactureUtileUrl {
        return this.factureUtile.url;
    }

    factures(): KfLien {
        return Fabrique.lien.retour(this.url.factures());
    }
    retourDUneFacture(facture: IKeyUidRno): KfLien {
        return Fabrique.lien.retour(this.url.retourDUneFacture(facture));
    }
    facture(facture: IKeyUidRno): KfLien {
        return Fabrique.lien.lien(this.def('', this.url.facture(facture), Fabrique.contenu.choisit));
    }
    factureCommande(factureCommande: FactureCommande): KfLien {
        return Fabrique.lien.lien(this.def('', this.url.factureCommande(factureCommande), Fabrique.contenu.edite));
    }
    retourDeFactureCommande(factureCommande: FactureCommande): KfLien {
        return Fabrique.lien.retour(this.url.retourDeFactureCommande(factureCommande), `Facturer ${factureCommande.client.nom}`);
    }
    retourDEnvoi(client: Client): KfLien {
        return Fabrique.lien.retour(this.url.facture(client), `Facturer ${client.nom}`);
    }
}
