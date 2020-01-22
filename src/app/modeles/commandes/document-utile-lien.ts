import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtile } from './document-utile';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { DocCLF } from './document';
import { LigneDocument } from './ligne-base';

export class DocumentUtileLien extends DataUtileLien {

    constructor(commandeUtile: DocumentUtile) {
        super(commandeUtile);
    }

    get commandeUtile(): DocumentUtile {
        return this.dataUtile as DocumentUtile;
    }

    get url(): DocumentUtileUrl {
        return this.commandeUtile.url;
    }

    desClients(): KfLien {
        return Fabrique.lien.retour(this.url.desClients());
    }
    retourDUnClient(commande: DocCLF): KfLien {
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
    choisitCommande(commande: DocCLF): KfLien {
        return Fabrique.lien.lien(this.def('', this.url.ajouteCommande(commande), Fabrique.contenu.choisit));
    }
    dUnClient(commande: DocCLF, aperçu?: boolean): KfLien {
        const contenu = aperçu ? Fabrique.contenu.aperçu : Fabrique.contenu.edite;
        return Fabrique.lien.lien(this.def('dUnClient', this.url.dUnClient(commande, aperçu), contenu));
    }
    supprimeCommande(commande: DocCLF): KfLien {
        const contenu = commande.crééParLeClient ? Fabrique.contenu.exclure : Fabrique.contenu.supprime;
        return Fabrique.lien.lien(this.def('', this.url.supprimeCommande(commande), contenu));
    }

    commande(): KfLien {
        return Fabrique.lien.lien(this.def('commande', this.url.commande(), { texte: 'Bon de commande' }));
    }

    choisit(détail: LigneDocument): KfLien {
        return Fabrique.lien.lien(this.def('choisit', this.url.ajoute(détail), Fabrique.contenu.choisit));
    }
    retourDétail(détail: LigneDocument): KfLien {
        return Fabrique.lien.retour(this.url.retourDétail(détail));
    }
    defAjoute(): ILienDef {
        return { url: this.url.choixProduit(), contenu: { texte: 'Ajouter une ligne' } };
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this.url.choixProduit(), 'Ajouter une ligne');
    }
    retourDeAjoute(détail: LigneDocument): KfLien {
        return Fabrique.lien.retour(this.url.retourDeAjoute(détail), 'Changer de produit');
    }
    edite(détail: LigneDocument, aperçu?: boolean): KfLien {
        const iconeDef = aperçu ? Fabrique.contenu.aperçu : Fabrique.contenu.edite;
        return Fabrique.lien.lien(this.def('edite', this.url.edite(détail), iconeDef));
    }
    supprime(détail: LigneDocument): KfLien {
        const iconeDef = détail.client && détail.parent.crééParLeClient ? Fabrique.contenu.exclure : Fabrique.contenu.supprime;
        return Fabrique.lien.lien(this.def('supprime', this.url.supprime(détail), iconeDef));
    }
}
