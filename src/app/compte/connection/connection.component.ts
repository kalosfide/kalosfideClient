import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ApiResult } from '../../helpers/api-results/api-result';
import { FormulaireComponent } from '../../helpers/formulaire/formulaire.component';

import { KfTexte } from '../../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfCaseACocher } from '../../helpers/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { UtilisateurService } from '../services/utilisateur.service';
import { AppApiRoutes } from '../../app-api-routes';
import { IdentificationService } from '../../s\u00E9curit\u00E9/identification.service';
import { KfLien } from '../../helpers/kf-composants/kf-elements/kf-lien/kf-lien';
import { CompteApiRoutes } from '../compte-api-routes';
import { ConnectionModel } from './connection.model';
import { KfAfficheResultat } from '../../helpers/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import {
    KfResultatAffichable,
    KfTypeResultatAffichable
} from '../../helpers/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';

const titreVientDEnregistrer = 'Félicitations. Vous avez maintenent votre compte.';
const détailsVientDEnregistrer: string[] = [
    `Après vous être connecté, vous serez redirigé vers la page des Roles.`,
    `Car pour être actif sur Kalosfide, il faut endosser un rôle`
];

@Component({
    selector: 'app-connection',
    templateUrl: '../../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class ConnectionComponent extends FormulaireComponent {

    constructor(
        private router: Router,
        private identification: IdentificationService,
        protected service: UtilisateurService
    ) {
        super(service);
        this.nom = 'connection';
        this.titre = 'Connection';

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Se connecter')];

        if (this.identification.vientDEnregistrer) {
            const afficheResultatEnregistre = new KfAfficheResultat('resultatEnregistre');
            afficheResultatEnregistre.finit(new KfResultatAffichable(
                KfTypeResultatAffichable.Ok,
                titreVientDEnregistrer,
                détailsVientDEnregistrer
            ));
            this.contenus.push(afficheResultatEnregistre);
        }

        const nom = new KfTexte('userName', 'Nom');
        nom.requis = true;
        this.contenus.push(nom);
        const password = new KfTexte('password', 'Mot de passe');
        password.typeDInput = 'password';
        password.requis = true;
        this.contenus.push(password);
        const persistant = new KfCaseACocher('persistant', 'Rester connecté');
        persistant.caseAprés = true;
        persistant.valeur = false;
        this.contenus.push(persistant);

        this.initialiseFormulaire = (): Observable<boolean> => {
            const unp = this.identification.vientDEnregistrer;
            if (unp) {
                const connectionModel = new ConnectionModel();
                connectionModel.userName = unp.un;
                connectionModel.password = unp.p;
                connectionModel.persistant = false;
                this.identification.fixeVientDEnregistrer();
                this.formulaire.gereValeur.rétablit(connectionModel);
                this.formulaire.formGroup.setValue(connectionModel);
                this.formulaire.formGroup.markAsDirty();
            }
            return of(true);
        };

        this.soumission = (): Observable<ApiResult> => {
            return this.service.connecte(this.formulaire.formGroup.value);
        };

        if (!this.identification.vientDEnregistrer) {
            this.lienRetour = new KfLien('lienRetour', CompteApiRoutes.Route(CompteApiRoutes.App.enregistrement),
                'Pas de compte ? Enregistrez-vous.');
        }

        this.actionSiOk = (): void => {
            console.log(this.identification.retourUrl);
            this.router.navigate([this.identification.retourUrl]);
        };
        this.titreRésultatErreur = 'Connection impossible';
    }

}
