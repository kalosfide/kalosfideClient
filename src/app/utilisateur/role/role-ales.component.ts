import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KfNombre } from '../../commun/kf-composants/kf-elements/kf-nombre/kf-nombre';
import { KfTexte } from '../../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';

import { ApiResult } from '../../commun/api-results/api-result';
import { Role } from './role';
import { RoleService } from './role.service';

import { KfRadios } from '../../commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { Title } from '@angular/platform-browser';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { TitreHtmlService } from '../../services/titreHtml.service';
import { DataKeyALESComponent } from '../../commun/data-par-key/data-key-ales.component';
import { DataChamp } from '../../commun/data-par-key/data-champ';
import { RoleEditeur } from './role-editeur';

export abstract class RoleALESComponent extends DataKeyALESComponent<Role> {

    protected _kfUtilisateurId: KfTexte;
    protected _kfNo: KfNombre;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: RoleService,
        protected titleService: Title,
        protected titreHtmlService: TitreHtmlService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, titleService, titreHtmlService, attenteAsyncService);
        this.titre = 'Ajouter un nouveau role';

        this.actionSiOk = (): void => {
            this.router.navigate(['..']);
        };

    }

    créeDataEditeur()  {
        this.dataEditeur = new RoleEditeur();
    }

}
