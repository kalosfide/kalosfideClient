import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { AppConfigService } from './app-config.service';
import { IdentificationService } from '../sécurité/identification.service';

@Injectable()
export class AutreService extends BaseService {

    public dataUrl = 'autre';

    constructor(
        http: HttpClient,
        config: AppConfigService,
        authentication: IdentificationService
    ) {
        super(http, config, authentication);
    }


}
