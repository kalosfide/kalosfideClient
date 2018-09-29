import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RoleService } from './role.service';
import { Title } from '@angular/platform-browser';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { RoleALESComponent } from './role-ales.component';
import { DataApiRoutes } from '../../commun/data-par-key/data-api-routes';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { map } from 'rxjs/operators';
import { ApiResult200Ok } from '../../commun/api-results/api-result-200-ok';
import { Role } from './role';
import { RoleEditeur } from './role-editeur';

@Component({
    templateUrl: '../../disposition/page-base/page-base.component.html',
    styles: []
})
export class RoleAjouteComponent extends RoleALESComponent implements OnInit {

    action = DataApiRoutes.Api.ajoute;

    nom = 'role';
    titreHtml = 'Role - Créer';
    titre = 'Ajouter un nouveau role';

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: RoleService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
        this.chargeAsync = [
            this.chargeAsync_ALES,
            (): Observable<ApiResult> => {
                return this.service.fournisseurs()
                .pipe(
                    map(
                        apiResult => {
                            if (apiResult.statusCode === 200) {
                                const fournisseurs = (apiResult as ApiResult200Ok<Role[]>).lecture;
                                (this.dataEditeur as RoleEditeur).fixeFournisseurs(fournisseurs);
                            }
                            return apiResult;
                        }
                    )
                );
    
            }
        ]
    }

    ngOnInit() {
        this.ngOnInit_TitreHtml();
        this.ngOnInit_CréeFormulaire();
        this.ngOnInit_Charge();
    }
}
