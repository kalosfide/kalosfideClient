import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../helpers/api-results/api-result';
import { FormulaireComponent } from '../../helpers/formulaire/formulaire.component';

import { MotDePasseService } from '../../helpers/mot-de-passe/mot-de-passe.service';
import { UtilisateurService } from '../services/utilisateur.service';

import { KfTexte } from '../../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../../helpers/kf-composants/kf-partages/kf-validateur';
import { ConnectionModel } from '../connection/connection.model';
import { KfTypeResultatAffichable } from '../../helpers/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfAfficheResultat } from '../../helpers/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { Router } from '@angular/router';
import { AppApiRoutes } from '../../app-api-routes';
import { map } from 'rxjs/operators';
import { Utilisateur } from '../utilisateur';
import { EnregistrementModel } from './enregistrement-model';
import { IdentificationService } from '../../s\u00E9curit\u00E9/identification.service';
import { CompteApiRoutes } from '../compte-api-routes';

@Component({
    selector: 'app-enregistrement',
    templateUrl: '../../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class EnregistrementComponent extends FormulaireComponent {
    private _kfTexteDuMotDePasse: KfTexte;

    private _kfResultatConnection: KfAfficheResultat;

    constructor(
        private router: Router,
        private motDePasseService: MotDePasseService,
        private identification: IdentificationService,
        protected service: UtilisateurService,
    ) {
        super(service);
        this.nom = 'Enregistrement';
        this.titre = 'Enregistrement';

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('S\'enregistrer')];

        const nom = new KfTexte('nom', 'Nom');
        nom.requis = true;
        this.contenus.push(nom);
        const email = new KfTexte('email', 'Adresse mail');
        email.typeDInput = 'email';
        email.requis = true;
        email.AjouteValidateur(KfValidateurs.email);
        this.contenus.push(email);
        this._kfTexteDuMotDePasse = new KfTexte('password', 'Mot de passe');
        this._kfTexteDuMotDePasse.typeDInput = 'password';
        this._kfTexteDuMotDePasse.requis = true;
        this.contenus.push(this._kfTexteDuMotDePasse);
        const confirme = new KfTexte('confirme', 'Confirmation du mot de passe');
        confirme.typeDInput = 'password';
        confirme.requis = true;
        const validateur = KfValidateurs.aLaValeurDe(this._kfTexteDuMotDePasse);
        validateur.message = 'La confirmation ne correspond pas au mot de passe.';
        confirme.AjouteValidateur(validateur);
        this.contenus.push(confirme);


        this.initialiseFormulaire = this._initialiseFormulaire;

        this.soumission = (): Observable<ApiResult> => {
            const valeur = this.formulaire.formGroup.value;
            const enregistrementModel = new EnregistrementModel();
            enregistrementModel.nom = valeur['nom'];
            enregistrementModel.email = valeur['email'];
            enregistrementModel.password = valeur['password'];
            console.log(enregistrementModel);
            return this.service.enregistre(enregistrementModel);
        };
        this.actionSiOk = (): void => {
            const valeur = this.formulaire.formGroup.value;
            this.identification.fixeVientDEnregistrer(valeur.nom, valeur.password);
            this.router.navigate([CompteApiRoutes.Route(CompteApiRoutes.App.connection)]);
        };
        this.titreRésultatErreur = 'Enregistrement impossible.';
        this.titreRésultatSucces = 'Enregistrement réussi. Connection en cours.';
    }

    _initialiseFormulaire(): Observable<boolean> {
        return this.motDePasseService.ValidateursDeMotDePasse().pipe(map(
            validateurs => {
                this._kfTexteDuMotDePasse.gereValeur.FixeValidateurs(validateurs);
                return true;
            }
        ));
    }

}
