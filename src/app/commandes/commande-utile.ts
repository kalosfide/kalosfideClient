import { DetailCommande } from './detail-commande';
import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtileBouton } from './commande-utile-bouton';
import { CommandeUtileOutils } from './commande-utile-outils';
import { CommandeUtileColonne } from './commande-utile-colonne';
import { ConditionAction, ModeAction } from './condition-action';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';
import { DataKeyUtile } from '../commun/data-par-key/data-key-utile';
import { ApiCommande } from './api-commande';
import { DataKeyService } from '../commun/data-par-key/data-key.service';
import { Conditions } from '../commun/condition/condition';

class ConditionsComposées extends Conditions<string> {
    constructor(utile: CommandeUtile) {
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

export class CommandeUtile extends DataKeyUtile<ApiCommande> {

    private _conditionAction: ConditionAction;
    private _condition: ConditionsComposées;

    constructor(service: DataKeyService<ApiCommande>) {
        super(service);
        this._url = new CommandeUtileUrl(this);
        this._lien = new CommandeUtileLien(this);
        this._outils = new CommandeUtileOutils(this);
    }

    get url(): CommandeUtileUrl {
        return this._url as CommandeUtileUrl;
    }

    get lien(): CommandeUtileLien {
        return this._lien as CommandeUtileLien;
    }

    get outils(): CommandeUtileOutils {
        return this._outils as CommandeUtileOutils;
    }

    get bouton(): CommandeUtileBouton {
        return this._bouton as CommandeUtileBouton;
    }

    get colonne(): CommandeUtileColonne {
        return this._colonne as CommandeUtileColonne;
    }

    inactivité(ligne: DetailCommande): boolean {
        return ligne.commandeCrééParLeClient && !ligne.apiCommande.livraisonNo;
    }

    retourneALaCommande() {
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
