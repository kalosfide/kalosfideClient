import { OnDestroy } from '@angular/core';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';


import { DataService } from '../../services/data.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { EtapeDeFormulaire, EtapeDeFormulaireEditeur } from './etape-de-formulaire';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { FormulaireFabrique } from './formulaire-fabrique';
import { KfResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { FormulaireAEtapeService } from './formulaire-a-etapes.service';
import { Router, NavigationEnd } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { filter } from 'rxjs/operators';
import { AppRoutes } from 'src/app/app-pages';
import { Observable } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';

export interface IFormulaireAEtapes {
    etapes: EtapeDeFormulaire[];
    formulaire: KfSuperGroupe;
    edition: KfGroupe;
    fixeIndex: (index: number) => void;
}

export abstract class FormulaireAEtapesComponent extends FormulaireBaseComponent implements IFormulaireAEtapes, OnDestroy {
    etapes: EtapeDeFormulaire[] = [];
    index: number;

    nomPrecedent = 'precedent';
    textePrecedent = 'Précédent';
    nomSuivant = 'suivant';
    texteSuivant = 'Suivant';

    nomSoumettre = 'soumettre';
    texteSoumettre = 'Terminer';

    abstract construitUrl(routeEtape: string): string;

    constructor(
        protected routeur: RouteurService,
        protected service: DataService,
        protected attenteAsyncService: AttenteAsyncService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService
        ) {
        super(service, attenteAsyncService);
    }

    peutQuitter = (): boolean | Observable<boolean> | Promise<boolean> => {
        if (this.formulaire.formGroup.pristine) {
            return true;
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }

    ajouteEtape(pageDef: PageDef, éditeur: EtapeDeFormulaireEditeur) {
        const etape = new EtapeDeFormulaire(this.etapes.length, pageDef, éditeur);
        etape.parent = this;
        this.etapes.push(etape);
    }

    fixeIndex(index: number) {
        this.index = index;
    }

    url(etape: EtapeDeFormulaire): string {
        if (this.inactive(etape)) {
            etape = this.etapes[this.index];
        }
        if (!etape) {
            etape = this.etapes[0];
        }
        return this.construitUrl(etape.pageDef.urlSegment);
    }

    choisie(etape: EtapeDeFormulaire): boolean {
        return this.index === etape.index;
    }

    private valideJusquA(index: number): boolean {
        let i = 0;
        for (; i < index; i++) {
            if (!this.etapes[i].estValide) {
                return false;
            }
        }
        return this.etapes[index].estValide;
    }

    inactive(etape?: EtapeDeFormulaire): boolean {
        return !(etape.index === 0 || this.valideJusquA(etape.index - 1));
    }

    nomNav(etape?: EtapeDeFormulaire): string {
        return etape.nom + 'nav';
    }

    créeBoutonPrécédent(index: number): KfBouton {
        const bouton = FormulaireFabrique.CréeBouton(this.nomPrecedent + index, this.textePrecedent);
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, (evenement: KfEvenement) => evenement.parametres = index - 1);
        return bouton;
    }

    créeBoutonSuivant(index: number): KfBouton {
        const bouton = FormulaireFabrique.CréeBouton(this.nomSuivant + index, this.texteSuivant);
        const url = this.url(this.etapes[index + 1]);
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, () => {
            this.routeur.navigate([url]);
        });
        return bouton;
    }

    créeBoutons(index: number): KfBouton[] {
        if (index === 0) {
            return [this.créeBoutonSuivant(0)];
        }
        if (index < this.etapes.length - 1) {
            return [this.créeBoutonPrécédent(index), this.créeBoutonSuivant(index)];
        }
        this.boutonSoumettre = FormulaireFabrique.CréeBoutonSoumettre(this.formulaire, this.texteSoumettre);
        return [this.créeBoutonPrécédent(index), this.boutonSoumettre];
    }

    contenusValidationParDéfaut(): KfComposant[] {
        return this.etapes.map(e => e.créeGroupeEtat());
    }

    protected créeFormulaire() {
        this.formulaire = new KfSuperGroupe(this.nom);
        this.formulaire.créeGereValeur();

        this.edition = new KfGroupe(this.nom);
        for (let i = 0; i < this.etapes.length; i++) {
            const etape = this.etapes[i];
            etape.créeEdition();
            if (i < this.etapes.length - 1) {
                etape.groupeEditeur.ajouteBoutonsDeFormulaire([this.créeBoutonSuivant(i)]);
            } else {
                this.boutonSoumettre = FormulaireFabrique.CréeBoutonSoumettre(this.formulaire, this.texteSoumettre);
                etape.groupeEditeur.ajouteBoutonsDeFormulaire([this.boutonSoumettre]);
                this.afficheResultat = FormulaireFabrique.AjouteAfficheResultat(this.formulaire, etape.groupeEditeur);
            }
            this.edition.ajoute(etape.groupeEditeur);
        }
        this.edition.avecUnSeulContenuVisible(() => this.index);

        this.formulaire.ajoute(this.edition);
        this.formulaire.sauveQuandChange = true;
        this.formulaire.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic, (evenement: KfEvenement) => {
            if (evenement.emetteur === this.boutonSoumettre) {
                this.soumet();
            }
        });
        this.formulaire.gereHtml.ajouteTraiteur(KfTypeDEvenement.soumet, (evenement: KfEvenement) => {
            if (evenement.emetteur === this.boutonSoumettre) {
                this.soumet();
            }
        });
        this.formulaire.quandTousAjoutés();
    }

    ngOnInit_Index() {
        this.routeur.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((navigationEnd: NavigationEnd) => {
                const segments = navigationEnd.urlAfterRedirects.split(AppRoutes.séparateur);
                const nomEtape = segments[segments.length - 1];
                const index = this.etapes.findIndex(etape => etape.pageDef.urlSegment === nomEtape);
                this.index = index === -1 ? 0 : index;
            });
        this.index = 0;
        this.etapesService.initialise(this);
    }

    ngOnDestroy() {
        this.etapesService.termine();
        this.ngOnDestroy_Subscriptions();
    }

    actionSiErreur = (resultat: KfResultatAffichable) => {
        if (resultat.type === KfTypeResultatAffichable.Echec) {
            if (!this.formulaire.formGroup.valid) {
                // TODO
                // marquer les erreurs de validation a posteriori dans les étapes
                // mettre des liens vers les étapes avec erreur
            }
        }
    }

    traite(evenement: KfEvenement) {
        switch (evenement.type) {
            case KfTypeDEvenement.soumet:
                this.soumet();
                break;
            case KfTypeDEvenement.clic:
                const index: number = evenement.parametres;
                this.routeur.navigate([this.url(this.etapes[index])]);
                break;
            default:
                break;
        }
    }

}
