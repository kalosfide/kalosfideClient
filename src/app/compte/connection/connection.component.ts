import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfCaseACocher } from '../../commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { KfTypeResultatAffichable } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';

import { UtilisateurService } from '../services/utilisateur.service';
import { IdentificationService } from '../../securite/identification.service';
import { Title } from '@angular/platform-browser';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';

import { ApiResult } from '../../commun/api-results/api-result';
import { CompteApiRoutes } from '../compte-api-routes';

import { ConnectionModel } from './connection.model';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

const titreVientDEnregistrer = 'Félicitations. Vous avez maintenent votre compte.';
const détailsVientDEnregistrer: string[] = [
    `Après vous être connecté, vous serez redirigé vers la page des Roles.`,
    `Car pour être actif sur Kalosfide, il faut endosser un rôle`
];

@Component({
    templateUrl: '../../disposition/page-base/page-base.component.html',
    styles: []
})
export class ConnectionComponent extends FormulaireComponent {

    nom = 'connection';
    titreHtml = 'Connection';
    titre = 'Connection';

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettreAsync('Se connecter')];
    soumission = (): Observable<ApiResult> => {
        return this.service.connecte(this.valeur);
    }

    actionSiOk = (): void => {
        console.log(this.identification.retourUrl);
        this.router.navigate([this.identification.retourUrl]);
    }

    constructor(
        private router: Router,
        private identification: IdentificationService,
        protected service: UtilisateurService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, titleService, titreHtmlService, attenteAsyncService);

        this.chargeAsync = null;
        this.titreRésultatErreur = 'Connection impossible';
    }

    créeEdition = (): KfGroupe => {
        const groupe = new KfGroupe('donnees');

        if (this.identification.vientDEnregistrer) {
            const afficheResultatEnregistre = new KfAfficheResultat('resultatEnregistre');
            afficheResultatEnregistre.finit(new KfResultatAffichable(
                KfTypeResultatAffichable.Ok,
                titreVientDEnregistrer,
                détailsVientDEnregistrer
            ));
            groupe.ajoute(afficheResultatEnregistre);
        }

        const nom = new KfTexte('userName', 'Nom');
        nom.requis = true;
        groupe.ajoute(nom);
        const password = new KfTexte('password', 'Mot de passe');
        password.typeDInput = 'password';
        password.requis = true;
        groupe.ajoute(password);
        const persistant = new KfCaseACocher('persistant', 'Rester connecté');
        persistant.caseAprés = true;
        persistant.valeur = false;
        groupe.ajoute(persistant);

        const unp = this.identification.vientDEnregistrer;
        if (unp) {
            nom.valeur = unp.un;
            password.valeur = unp.p;
        } else {
            this.lienRetour = new KfLien('lienRetour', CompteApiRoutes.Route(CompteApiRoutes.App.enregistrement),
                'Pas de compte ? Enregistrez-vous.');
        }

        return groupe;
    }

}
