import { OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../../commun/kf-composants/kf-composants-types';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { PageBaseComponent } from '../page-base/page-base.component';

export abstract class FormulaireBaseComponent extends PageBaseComponent {

    titreRésultatErreur: string;
    titreRésultatSucces: string;

    boutonsDeFormulaire = [];
    abstract créeEdition: () => KfGroupe;
    abstract créeBoutonsDeFormulaire: () => KfBouton[];
    abstract actionSiOk: () => void;
    abstract soumission: () => Observable<ApiResult>;

    lienRetour: KfLien;

    // membres communs
    formulaire: KfSuperGroupe;
    edition: KfGroupe;

    subscriptions: Subscription[] = [];

    boutonSoumettreAsync: KfBouton;
    afficheResultat: KfAfficheResultat;

    constructor(
        protected service: DataService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(titleService, titreHtmlService, attenteAsyncService);
    }

    get valeur(): any {
        return this.edition.formGroup.value;
    }
    set valeur(valeur: any) {
        this.edition.formGroup.setValue(valeur);
    }

    ngOnInit_CréeFormulaire() {
        this.formulaire = new KfSuperGroupe(this.nom);
        this.edition = this.créeEdition();
        if (this.edition.texte) {
            this.formulaire.fixeTexte(this.edition.texte);
        }
        this.formulaire.ajoute(this.edition);
        this.boutonsDeFormulaire = this.créeBoutonsDeFormulaire();
        this.formulaire.ajouteBoutonsDeFormulaire(this.boutonsDeFormulaire);
        this.afficheResultat = new KfAfficheResultat(this.nom + '_resultat');
        this.afficheResultat.visibiliteFnc =
            () => {
                const form = this.formulaire.formGroup;
                return form && form.pristine;
            };
        this.formulaire.ajoute(this.afficheResultat);
        if (this.lienRetour) {
            const groupe = new KfGroupe('');
            groupe.ajoute(this.lienRetour);
            this.formulaire.ajoute(groupe);
        }
        this.formulaire.quandTousAjoutés();
    }

    créeBouton(nom: string, texte?: string, image?: string): KfBouton {
        const bouton = new KfBouton(nom, texte, image);
        bouton.ajouteClasse('btn', 'btn-light');
        return bouton;
    }

    créeBoutonSoumettreAsync(texte?: string, image?: string): KfBouton {
        const bouton = this.créeBouton('bouton_soumettre', texte, image);
        bouton.typeDeBouton = KfTypeDeBouton.soumettre;
        this.boutonSoumettreAsync = bouton;
        return bouton;
    }

    soumet() {
        this.attenteAsyncService.commence();
        this.afficheResultat.commence();
        const subscription = ApiResult.résultatSoumission$(
            this.formulaire,
            this.soumission(),
            this.titreRésultatErreur,
            this.titreRésultatSucces,
        ).subscribe(
            resultat => {
                console.log(resultat);
                subscription.unsubscribe();
                this.attenteAsyncService.finit();
                this.afficheResultat.finit(resultat);
                if (resultat.type === KfTypeResultatAffichable.Ok) {
                    this.actionSiOk();
                }
            }
        );
    }
}
