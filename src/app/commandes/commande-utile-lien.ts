import { DetailCommande } from './detail-commande';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from '../disposition/fabrique/fabrique-lien';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { CommandeUtileUrl } from './commande-utile-url';
import { Commande } from './commande';
import { LivraisonProduit } from '../fournisseur/livraisons/livraison-produit';
import { CommandeUtile } from './commande-utile';
import { DataUtileLien } from '../commun/data-par-key/data-utile-lien';

export class CommandeUtileLien extends DataUtileLien {

    constructor(commandeUtile: CommandeUtile) {
        super(commandeUtile);
    }

    get commandeUtile(): CommandeUtile {
        return this.dataUtile as CommandeUtile;
    }

    get url(): CommandeUtileUrl {
        return this.commandeUtile.url;
    }

    desClients(): KfLien {
        return Fabrique.lien.retour(this.url.desClients());
    }
    retourDUnClient(commande: Commande): KfLien {
        return Fabrique.lien.retour(this.url.retourDUnClient(commande), 'Commandes');
    }
    defAjouteCommande(): ILienDef {
        return {
            url: this.url.choixClient(),
            contenu: { texte: 'Commander pour un client' }
        };
    }
    ajouteCommande(): KfLien {
        return Fabrique.lien.ajoute(this.url.choixClient(), 'Commander pour un client');
    }
    choisitCommande(commande: Commande): KfLien {
        return Fabrique.lien.lien(this.def('', this.url.ajouteCommande(commande), Fabrique.contenu.choisit));
    }
    dUnClient(commande: Commande, aperçu?: boolean): KfLien {
        const contenu = aperçu ? Fabrique.contenu.aperçu : Fabrique.contenu.edite;
        return Fabrique.lien.lien(this.def('dUnClient', this.url.dUnClient(commande, aperçu), contenu));
    }
    supprimeCommande(commande: Commande): KfLien {
        const contenu = commande.crééeParLeClient ? Fabrique.contenu.exclure : Fabrique.contenu.supprime;
        return Fabrique.lien.lien(this.def('', this.url.supprimeCommande(commande), contenu));
    }

    desProduits(): KfLien {
        return Fabrique.lien.retour(this.url.desProduits());
    }
    retourDUnProduit(livraisonProduit: LivraisonProduit): KfLien {
        return Fabrique.lien.retour(this.url.retourDUnProduit(livraisonProduit));
    }
    dUnProduit(livraisonProduit: LivraisonProduit, aperçu?: boolean): KfLien {
        const contenu = aperçu ? Fabrique.contenu.aperçu : Fabrique.contenu.edite;
        return Fabrique.lien.lien(this.def('dUnProduit', this.url.dUnProduit(livraisonProduit), contenu));
    }

    commande(): KfLien {
        return Fabrique.lien.lien(this.def('commande', this.url.commande(), { texte: 'Bon de commande' }));
    }

    choisit(détail: DetailCommande): KfLien {
        return Fabrique.lien.lien(this.def('choisit', this.url.ajoute(détail), Fabrique.contenu.choisit));
    }
    retourDétail(détail: DetailCommande): KfLien {
        return Fabrique.lien.retour(this.url.retourDétail(détail));
    }
    defAjoute(): ILienDef {
        return { url: this.url.choixProduit(), contenu: { texte: 'Ajouter une ligne' } };
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this.url.choixProduit(), 'Ajouter une ligne');
    }
    retourDeAjoute(détail: DetailCommande): KfLien {
        return Fabrique.lien.retour(this.url.retourDeAjoute(détail), 'Changer de produit');
    }
    edite(détail: DetailCommande, aperçu?: boolean): KfLien {
        const iconeDef = aperçu ? Fabrique.contenu.aperçu : Fabrique.contenu.edite;
        return Fabrique.lien.lien(this.def('edite', this.url.edite(détail), iconeDef));
    }
    supprime(détail: DetailCommande): KfLien {
        const iconeDef = détail.client && détail.commandeCrééParLeClient ? Fabrique.contenu.exclure : Fabrique.contenu.supprime;
        return Fabrique.lien.lien(this.def('supprime', this.url.supprime(détail), iconeDef));
    }
}
