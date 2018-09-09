import { Component } from '@angular/core';

import { KfComposant } from '../../helpers/kf-composants/kf-composant/kf-composant';
import { KfLien } from '../../helpers/kf-composants/kf-elements/kf-lien/kf-lien';

import { DataIndexComponent } from '../../helpers/data-index/data-index.component';

import { Role } from './role';
import { RoleService } from './role.service';
import { RoleApiRoutes } from './role-api-routes';

@Component({
    templateUrl: '../../helpers/data-index/data-index.component.html',
    styles: []
})
export class RoleIndexComponent extends DataIndexComponent<Role> {

    constructor(
        private service: RoleService
    ) {
        super();
        this.titre = 'Liste des roles';
        this.avantTable = new KfLien('ajouter', RoleApiRoutes.Route(RoleApiRoutes.App.ajoute), 'Ajouter un role');
        this.colonnes = ['Nom', 'Adresse', 'Droit'];
        this.liste = () => this.service.liste();
        this.valeur = (role: Role, colonne: string): string => {
            switch (colonne) {
                case 'Nom':
                    return role.nom;
                case 'Adresse':
                    return role.adresse;
                case 'Droit':
                    return role.type;
                default:
                    break;
            }
        };
        this.commandes = (role: Role): KfComposant[] => {
            const commandes = [
                new KfLien('editer', RoleApiRoutes.Route(RoleApiRoutes.App.edite))
            ];
            return commandes;
        };
    }

}
