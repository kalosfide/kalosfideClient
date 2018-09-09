import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription, of } from 'rxjs';

import { ApiResult } from '../api-results/api-result';

import { BaseService } from '../../services/base.service';

import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton } from '../kf-composants/kf-composants-types';
import { KfAnimeAttente } from '../kf-composants/kf-elements/kf-anime-attente/kf-anime-attente';
import { KfAnimeAttenteFabrique, KfTypeAnimeAttente } from '../kf-composants/kf-elements/kf-anime-attente/kf-anime-attente-fabrique';
import { KfAfficheResultat } from '../kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfTypeResultatAffichable } from '../kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    selector: 'app-formulaire',
    templateUrl: './formulaire.component.html',
    styles: []
})
export class FormulaireComponent implements OnInit, OnDestroy {

    // membres à fixer dans le constructeur
    nom: string;
    titre: string;

    titreRésultatErreur: string;
    titreRésultatSucces: string;

    boutonsDeFormulaire: KfBouton[];
    actionSiOk: () => void;
    soumission: () => Observable<ApiResult>;
    initialiseFormulaire: () => Observable<boolean>;
    contenus: KfComposant[] = [];
    autresAffichages: KfAfficheResultat[];

    lienRetour: KfLien;

    complet: Observable<boolean>;

    // membres communs
    formulaire: KfSuperGroupe;
    subscriptions: Subscription[] = [];

    animeAttente: KfAnimeAttente;
    boutonSoumettreAsync: KfBouton;
    afficheResultat: KfAfficheResultat;

    constructor(
        protected service: BaseService
    ) { }

    créeFormulaire() {
        if (this.formulaire) {
            return;
        }
        this.formulaire = new KfSuperGroupe(this.nom);
        this.animeAttente = KfAnimeAttenteFabrique.CréeAnimeAttente(this.nom + '_attente', KfTypeAnimeAttente.Bounce);
        this.formulaire.ajoute(this.animeAttente);
        this.contenus.forEach(
            c => {
                this.formulaire.ajoute(c);
            });
        this.formulaire.ajouteBoutonsDeFormulaire(this.boutonsDeFormulaire);
        this.afficheResultat = new KfAfficheResultat(this.nom + '_resultat');
        this.afficheResultat.visibiliteFnc =
            () => {
                const form = this.formulaire.formGroup;
                return form && form.pristine;
            };
        this.formulaire.ajoute(this.afficheResultat);
        if (this.autresAffichages) {
            this.autresAffichages.forEach(
                a => {
                    this.formulaire.ajoute(a);
                }
            );
        }
        if (this.lienRetour) {
            this.formulaire.ajoute(this.lienRetour);
        }
        this.formulaire.quandTousAjoutés();
        console.log('quandTousAjoutés', this.formulaire.valeur);
    }

    créeBoutonSoumettreAsync(texte?: string, image?: string): KfBouton {
        const bouton = new KfBouton('bouton', texte, image);
        bouton.typeDeBouton = KfTypeDeBouton.soumettre;
        bouton.ajouteClasse('btn', 'btn-light');
        this.boutonSoumettreAsync = bouton;
        return bouton;
    }

    get actionEnCours(): boolean {
        if (this.animeAttente) {
            return this.animeAttente.enCours;
        }
    }

    ngOnInit() {
        this.créeFormulaire();
        if (this.initialiseFormulaire) {
           this.complet = this.initialiseFormulaire();
        } else {
            this.complet = of(true);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            const bouton = this.boutonSoumettreAsync;
            this.animeAttente.commence();
            this.afficheResultat.commence();
            const subscription = ApiResult.transformeApiResult$(
                this.formulaire,
                this.soumission(),
                this.titreRésultatErreur,
                this.titreRésultatSucces)
                .subscribe(
                    resultat => {
                        console.log(resultat);
                        subscription.unsubscribe();
                        this.animeAttente.finit();
                        this.afficheResultat.finit(resultat);
                        if (resultat.type === KfTypeResultatAffichable.Ok) {
                            this.actionSiOk();
                        }
                    }
                );
        }
    }

}
