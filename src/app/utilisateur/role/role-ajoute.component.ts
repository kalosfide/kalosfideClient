import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { KfNombre } from '../../helpers/kf-composants/kf-elements/kf-nombre/kf-nombre';
import { KfTexte } from '../../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../../helpers/kf-composants/kf-partages/kf-validateur';
import { KfLien } from '../../helpers/kf-composants/kf-elements/kf-lien/kf-lien';

import { ApiResult } from '../../helpers/api-results/api-result';
import { FormulaireComponent } from '../../helpers/formulaire/formulaire.component';
import { Role } from './role';
import { RoleService } from './role.service';
import { ApiResult200Ok } from '../../helpers/api-results/api-result-200-ok';
import { Identifiant } from '../../s\u00E9curit\u00E9/identifiant';
import { KfRadios } from '../../helpers/kf-composants/kf-elements/kf-radios/kf-radios';

@Component({
    templateUrl: '../../helpers/formulaire/formulaire.component.html',
    styles: []
})
export class RoleAjouteComponent extends FormulaireComponent {

    public role: Role;

    constructor(
        protected service: RoleService,
        private router: Router
    ) {
        super(service);
        this.nom = 'role';
        this.titre = 'Ajouter un nouveau role';

        const idUtilisateur = new KfTexte('idUtilisateur');
        idUtilisateur.gereVisible.visibilite = false;
        this.contenus.push(idUtilisateur);
        const no = new KfNombre('no');
        no.gereVisible.visibilite = false;
        this.contenus.push(no);

        const type = new KfRadios('type');
        type.AjouteChoix('administrateur', 'A', 'Administrateur');
        type.AjouteChoix('fournisseur', 'F', 'F');
        type.AjouteChoix('client', 'C', 'Client');
        this.contenus.push(type);

        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        nom.AjouteValidateur(KfValidateurs.doublon(nom.nom));
        this.contenus.push(nom);
        const adresse = new KfTexte('adresse', 'Adresse');
        adresse.AjouteValidateur(KfValidateurs.longueurMax(200));
        this.contenus.push(adresse);

        this.boutonsDeFormulaire = [this.créeBoutonSoumettreAsync('Ajouter')];

        this.initialiseFormulaire = () => this._initialiseFormulaire();

        this.lienRetour = new KfLien('lienRetour', '..', 'Retour à la liste');

        this.soumission = (): Observable<ApiResult> => {
            return this.service.ajoute(this.formulaire.formGroup.value);
        };


    }
    _initialiseFormulaire(): Observable<boolean> {
        return this.service.créeEntité().pipe(
            map((role: Role) => {
                this.formulaire.gereValeur.rétablit(role);
                this.formulaire.formGroup.setValue(role);
                return true;
                }
            )
        );
    }
}
