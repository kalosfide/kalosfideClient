import { OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { FormulaireFabrique } from './formulaire-fabrique';

export abstract class FormulaireComponent extends FormulaireBaseComponent implements OnInit, OnDestroy {

    boutonsDeFormulaire = [];
    abstract créeEdition: () => KfGroupe;
    abstract créeBoutonsDeFormulaire: () => KfBouton[];

    abstract actionSiOk: () => void;
    abstract soumission: () => Observable<ApiResult>;

    lienRetour: KfLien;

    // membres communs
    formulaire: KfSuperGroupe;
    edition: KfGroupe;

    boutonSoumettre: KfBouton;
    afficheResultat: KfAfficheResultat;

    constructor(
        protected service: DataService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, attenteAsyncService);
    }

    protected créeFormulaire() {
        this.formulaire = new KfSuperGroupe(this.nom);
        this.edition = this.créeEdition();
        if (this.edition.gereValeur) {
            this.formulaire.créeGereValeur();
        }
        this.formulaire.ajoute(this.edition);
        this.boutonsDeFormulaire = this.créeBoutonsDeFormulaire();
        this.formulaire.ajouteBoutonsDeFormulaire(this.boutonsDeFormulaire);
        this.afficheResultat = FormulaireFabrique.AjouteAfficheResultat(this.formulaire);
        FormulaireFabrique.AjouteLienRetour(this.formulaire, this.lienRetour);
        if (this.edition.gereValeur) {
            this.formulaire.quandTousAjoutés();
        }
    }

    ngOnInit() {
        this.créeFormulaire();
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            this.soumet();
        }
    }

}
