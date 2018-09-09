import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BaseService } from '../../services/base.service';
import { AppConfigService } from '../../services/app-config.service';
import { IdentificationService } from '../../sécurité/identification.service';
import { ApiResult } from '../../helpers/api-results/api-result';
import { Role } from './role';
import { IdNoService } from '../../services/id-no.service';

@Injectable()
export class RoleService extends IdNoService<Role> {

    public dataUrl = 'role';

    constructor(
        http: HttpClient,
        config: AppConfigService,
        identification: IdentificationService
    ) {
        super(http, config, identification);
    }

    _créeEntité(utilisateurId: string, no: number): Role {
        const role = new Role();
        role.utilisateurId = utilisateurId;
        role.no = no;
        return role;
    }

}
