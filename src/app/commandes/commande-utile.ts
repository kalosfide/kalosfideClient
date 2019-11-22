import { DetailCommande } from './detail-commande';
import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtileBouton } from './commande-utile-bouton';
import { CommandeUtileOutils } from './commande-utile-outils';
import { CommandeUtileColonne } from './commande-utile-colonne';
import { CommandeService } from './commande.service';
import { ConditionAction, ModeAction } from './condition-action';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';
import { DataKeyUtile } from '../commun/data-par-key/data-key-utile';
import { ApiCommande } from './api-commande';
import { DataKeyService } from '../commun/data-par-key/data-key.service';

export class CommandeUtile extends DataKeyUtile<ApiCommande> {

    private _conditionAction: ConditionAction;

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
        return ligne.crééParLeClient && !this.conditionSite.livraison.valeur;
    }

    retourneALaCommande() {
        this.routeur.navigueUrlDef(this.lien.url.commande());
    }

    observeModeAction(modeActioIO: KfInitialObservable<ModeAction>) {
        this._conditionAction = new ConditionAction(modeActioIO);
    }

    créeAutresConditions() {
    }

    get conditionAction(): ConditionAction {
        return this._conditionAction;
    }
}
