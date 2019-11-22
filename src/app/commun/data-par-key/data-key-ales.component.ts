import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';


import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { DataKeyService } from './data-key.service';
import { ApiResult } from '../api-results/api-result';
import { DataTexteSoumettre, IDataPages } from './data-pages';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataKey } from './data-key';
import { DataKeyEditeur } from './data-key-editeur';
import { ApiAction } from '../api-route';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { Site } from 'src/app/modeles/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTexteDef } from '../kf-composants/kf-partages/kf-texte-def';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { OnInit } from '@angular/core';
import { ITitrePage } from 'src/app/disposition/titre-page/titre-page';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { KfBouton } from '../kf-composants/kf-elements/kf-bouton/kf-bouton';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../kf-composants/kf-composants-types';

export class ActionAles {
    nom: string;
    texteSoumettre: string;
    apiDemande: () => Observable<ApiResult>;
    actionSiOk?: () => void;
}

export abstract class DataKeyALESComponent<T extends DataKey> extends FormulaireComponent implements OnInit {

    abstract site: Site;
    get nomSiteDef(): KfTexteDef {
        return () => this.site.nomSite;
    }

    action: ActionAles;

    créeBoutonsDeFormulaire: (formulaire: KfSuperGroupe) => (KfLien | KfBouton)[];

    fixeGroupeBoutonsMessages: () => void;

    protected chargeData: (data: Data) => void;
    protected contenuAidePage: () => KfComposant[];

    private _lienIndex: KfLien;

    dataEditeur: DataKeyEditeur<T>;
    abstract créeDataEditeur(): void;

    constructor(
        protected route: ActivatedRoute,
        protected _service: DataKeyService<T>,
    ) {
        super(_service);
    }

    créeBarreTitre = (): BarreTitre => {
        const def: IBarreDef = {
            pageDef: this.pageDef,
            boutonsPourBtnGroup: [[this._lienIndex]]
        };
        if (this.contenuAidePage) {
            def.contenuAidePage = this.contenuAidePage();
        }
        const barre = Fabrique.barreTitre.barreTitre(def);
        return barre;
    }

    actionAjoute(): ActionAles {
        return {
            // this.valeur contient la clé (incomplète si numAuto) et tous les autres champs
            nom: ApiAction.data.ajoute,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.ajoute),
            apiDemande: () => this._service.ajoute(this.valeur)
        };
    }

    actionEdite(): ActionAles {
        return {
            // this.valeur contient la clé et les champs modifiables
            nom: ApiAction.data.edite,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.edite),
            apiDemande: () => this._service.edite(this.valeur)
        };
    }

    actionSupprime(): ActionAles {
        return {
            // this.valeur ne contient que la clé IMPORTANT
            nom: ApiAction.data.supprime,
            texteSoumettre: DataTexteSoumettre(ApiAction.data.supprime),
            apiDemande: () => this._service.supprime(this.valeur)
        };
    }

    créeEdition = (): KfGroupe => {
        this.créeDataEditeur();
        this.dataEditeur.créeEdition(this);
        return this.dataEditeur.edition;
    }

    private prépareKeyAjout() {
        const key = this._service.keyDeAjoute;
        this.dataEditeur.fixeChampsKeys(key);
    }

    ngOnInit() {
        this.site = this._service.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                if (this.action.nom === ApiAction.data.ajoute) {
                    this._lienIndex = this._service.utile.lienKey.index();
                    this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe) => [
                        Fabrique.bouton.boutonSoumettre(formulaire, this.action.texteSoumettre),
                        Fabrique.lien.boutonAnnuler(this._service.utile.urlKey.index()),
                    ];
                } else {
                    this._lienIndex = this._service.utile.lienKey.retourIndex(data.valeur);
                    this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe) => [
                        Fabrique.bouton.boutonSoumettre(formulaire, this.action.texteSoumettre),
                        Fabrique.lien.boutonAnnuler(this._service.utile.urlKey.retourIndex(data.valeur)),
                    ];
                }
                this.formulaire = Fabrique.formulaire.formulaire(this);
                if (this.chargeData) {
                    this.chargeData(data);
                }
                this.créeTitrePage();
                if (this.action.nom === ApiAction.data.ajoute) {
                    this.prépareKeyAjout();
                } else {
                    this.fixeValeur(data.valeur);
                }
                if (this.fixeGroupeBoutonsMessages) {
                    this.fixeGroupeBoutonsMessages();
                }
            }
        ));
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.action.apiDemande();
    }

    actionSiOk = (): void => {
        if (this.action.actionSiOk) {
            this.action.actionSiOk();
        }
        this.routeur.navigueUrlDef(this._service.utile.urlKey.index());
    }

    get valeur(): any {
        if (this.dataEditeur && this.dataEditeur.valeur) {
            return this.dataEditeur.valeur;
        }
    }

    fixeValeur(valeur: any) {
        this.dataEditeur.fixeValeur(valeur);
    }
}
