import { Component } from '@angular/core';

import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';

import { Role } from './role';
import { RoleService } from './role.service';
import { RoleApiRoutes } from './role-api-routes';
import { IdentificationService } from '../../securite/identification.service';
import { Title } from '@angular/platform-browser';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';

import { KeyUidNoIndexComponent } from '../../commun/data-par-key/key-uid-no/key-uid-no-index.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: '../../disposition/page-base/page-base.component.html',
    styles: []
})
export class RoleIndexComponent extends KeyUidNoIndexComponent<Role> {

    nom = 'liste_roles';
    titreHtml = 'Role - Liste';
    titre = 'Liste des roles';

    colonnes = ['Nom', 'Adresse', 'Droit', ''];
    cellules = (role: Role): (string | KfComposant[])[] => [
        role.nom,
        role.adresse,
        role.type,
        [
            this.créeLienEdite(role),
        ]
    ]
    choisie = (role: Role) => this.identification.roleNo() === role.no;

    constructor(
        private identification: IdentificationService,
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: RoleService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
        this.filtrePropriétaire = true;
        this.apresTable = [new KfLien('ajouter', RoleApiRoutes.Route(RoleApiRoutes.App.ajoute), 'Ajouter un role')];
    }

    fixeAvantTable() { }
}
