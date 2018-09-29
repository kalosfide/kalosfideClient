import { FormulaireBaseComponent } from './formulaire-base.component';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { EtapeDeFormulaire } from './etape-de-formulaire';
import { Component, Input, OnInit, Output } from '@angular/core';
import { KfEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { DataService } from '../../services/data.service';
import { Title } from '@angular/platform-browser';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';

@Component({
    selector: 'app-etape-de-formulaire',
})
export abstract class EtapeDeFormulaireComponent extends FormulaireBaseComponent implements OnInit {
    @Input() etape: EtapeDeFormulaire;
    @Output() etapeSortie: EtapeDeFormulaire;

    protected nom: string;
    protected titreHtml: string;
    protected titre: string;
    créeEdition: () => KfGroupe;

    soumission = null;
    actionSiOk = null;

    constructor(
        protected service: DataService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);
    }

    ngOnInit() {
        this.nom = this.etape.nom;
        this.titreHtml = this.etape.titreHtml;
        this.titre = this.etape.titre;
        this.créeEdition = this.etape.créeEdition;
    }

    get superGroupe(): KfSuperGroupe {
        return this.formulaire;
    }

    créeBoutonsDeFormulaire = (): KfBouton[] => {
        const boutonSuivant = this.créeBoutonSoumettreAsync(this.etape.texteBoutonSuivant);
        if (this.etape.précédente) {
            const boutonPrécédent = this.créeBouton(this.etape.précédente.titre);
            return [boutonPrécédent, boutonSuivant];
        }
        return [boutonSuivant];
    }

    traite(evenement: KfEvenement) {
        if (evenement.emetteur === this.boutonSoumettreAsync) {}
    }
}
