import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';

import { ApiResult } from '../../commun/api-results/api-result';

import { MotDePasseService } from '../../commun/mot-de-passe/mot-de-passe.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { IdentificationService } from '../../securite/identification.service';
import { CompteApiRoutes } from '../compte-api-routes';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';

import { EnregistrementModel } from './enregistrement-model';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { ApiResult200Ok } from '../../commun/api-results/api-result-200-ok';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

@Component({
    templateUrl: '../../disposition/page-base/page-base.component.html',
    styles: []
})
export class EnregistrementComponent extends FormulaireComponent {

    private _kfTexteDuMotDePasse: KfTexte;

    nom = 'Enregistrement';
    titreHtml = 'Enregistrement';
    titre = 'Enregistrement';

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettreAsync(`S'enregistrer`)];


    soumission = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        const enregistrementModel = new EnregistrementModel();
        enregistrementModel.nom = valeur['nom'];
        enregistrementModel.email = valeur['email'];
        enregistrementModel.password = valeur['password'];
        console.log(enregistrementModel);
        return this.service.enregistre(enregistrementModel);
    }

    actionSiOk = (): void => {
        const valeur = this.formulaire.formGroup.value;
        this.identification.fixeVientDEnregistrer(valeur.nom, valeur.password);
        this.router.navigate([CompteApiRoutes.Route(CompteApiRoutes.App.connection)]);
    }

    constructor(
        private router: Router,
        private motDePasseService: MotDePasseService,
        private identification: IdentificationService,
        protected service: UtilisateurService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);

        this.chargeAsync = [this.chargeValidateursDeMotDePasse];
        this.titreRésultatErreur = 'Enregistrement impossible.';
        this.titreRésultatSucces = 'Enregistrement réussi. Connection en cours.';
    }

    chargeValidateursDeMotDePasse(): Observable<ApiResult> {
        const validateurs = this._kfTexteDuMotDePasse.gereValeur.Validateurs;
        return this.motDePasseService.FixeValidateurs(validateurs);
    }

    créeEdition = (): KfGroupe => {
        const groupe = new KfGroupe('donnees');

        const nom = new KfTexte('nom', 'Nom');
        nom.requis = true;
        groupe.ajoute(nom);
        const email = new KfTexte('email', 'Adresse mail');
        email.typeDInput = 'email';
        email.requis = true;
        email.AjouteValidateur(KfValidateurs.email);
        groupe.ajoute(email);
        this._kfTexteDuMotDePasse = new KfTexte('password', 'Mot de passe');
        this._kfTexteDuMotDePasse.typeDInput = 'password';
        this._kfTexteDuMotDePasse.requis = true;
        groupe.ajoute(this._kfTexteDuMotDePasse);
        const confirme = new KfTexte('confirme', 'Confirmation du mot de passe');
        confirme.typeDInput = 'password';
        confirme.requis = true;
        const validateur = KfValidateurs.aLaValeurDe(this._kfTexteDuMotDePasse);
        validateur.message = 'La confirmation ne correspond pas au mot de passe.';
        confirme.AjouteValidateur(validateur);
        groupe.ajoute(confirme);

        return groupe;
    }

}
