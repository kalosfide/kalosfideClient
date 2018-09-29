import { Injectable } from '@angular/core';


import { SiteInfo } from './site-info';

@Injectable()
export class SiteInfoStaticService {

    constructor(    ) {
    }

    public get siteInfo(): SiteInfo {
        return {
            id: 0,
            nom: 'kalofide.fr',
            titre: 'Kalosfide',
            date: '2018'
        };
    }

}
