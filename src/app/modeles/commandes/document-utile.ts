import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtileLien } from './document-utile-lien';
import { DocumentUtileBouton } from './document-utile-bouton';
import { DocumentUtileOutils } from './document-utile-outils';
import { DocumentUtileColonne } from './document-utile-colonne';
import { ConditionAction, ModeAction } from './condition-action';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { DataKeyService } from 'src/app/commun/data-par-key/data-key.service';
import { Conditions } from 'src/app/commun/condition/condition';
import { ApiDocument } from './api-document';
import { LigneDocument } from './ligne-base';

class ConditionsComposées extends Conditions<string> {
    constructor(utile: DocumentUtile) {
        super();
        this.ajoute('catalogueOuPasDeClients', KfInitialObservable.ou(utile.conditionSite.catalogue,
            KfInitialObservable.nouveau(utile.site.nbClients === 0)));
        this.ajoute('editeOuAperçu', KfInitialObservable.ou(utile.conditionAction.edite, utile.conditionAction.aperçu));
    }

    /**
     * vrai si le site est dans l'état Catalogue ou n'a pas de client
     */
    get catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.conditionIO('catalogueOuPasDeClients');
    }

    /**
     * vrai si le site n'est pas dans l'état Catalogue et a des clients
     */
    get non_catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.pas_conditionIO('catalogueOuPasDeClients');
    }

    /**
     * vrai si le site n'est pas dans l'état Livraison ou si l'action est Edite ou Aperçu
     */
    get editeOuAperçu(): KfInitialObservable<boolean> {
        return this.conditionIO('editeOuAperçu');
    }
}

export class DocumentUtile extends DataKeyUtile<ApiDocument> {
    titres = {
        categorie: 'Catégorie',
        produit: 'Produit',
        prix: 'Prix',
        typeCommande: { choixProduit: 'Se commande', client: 'Unité', fournisseur: 'U. C.' },
        typeMesure: { commande: 'U. V.', livraison: 'Unité', facture: 'Unité' },
        demande: { client: 'Quantité', fournisseur: 'Demandé' },
        aLivrer: { commande: 'A livrer', livraison: 'Quantité', facture: 'Livrés' }
    };

    private _conditionAction: ConditionAction;
    private _condition: ConditionsComposées;

    constructor(service: DataKeyService<ApiDocument>) {
        super(service);
        this._url = new DocumentUtileUrl(this);
        this._lien = new DocumentUtileLien(this);
        this._outils = new DocumentUtileOutils(this);
    }

    get url(): DocumentUtileUrl {
        return this._url as DocumentUtileUrl;
    }

    get lien(): DocumentUtileLien {
        return this._lien as DocumentUtileLien;
    }

    get outils(): DocumentUtileOutils {
        return this._outils as DocumentUtileOutils;
    }

    get bouton(): DocumentUtileBouton {
        return this._bouton as DocumentUtileBouton;
    }

    get colonne(): DocumentUtileColonne {
        return this._colonne as DocumentUtileColonne;
    }

    inactivité(ligne: LigneDocument): boolean {
        return ligne.parent.crééParLeClient && !ligne.parent.apiDoc.parentNo;
    }

    retourneALaDocument() {
        this.routeur.navigueUrlDef(this.lien.url.commande());
    }

    observeModeAction(modeActioIO: KfInitialObservable<ModeAction>) {
        this._conditionAction = new ConditionAction(modeActioIO);
    }

    get conditionAction(): ConditionAction {
        return this._conditionAction;
    }

    créeAutresConditions() {
        this._condition = new ConditionsComposées(this);
    }

    get condition(): ConditionsComposées {
        return this._condition;
    }
}
