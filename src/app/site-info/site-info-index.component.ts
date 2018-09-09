import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { ApiResult200Ok } from '../helpers/api-results/api-result-200-ok';

import { SiteInfoService } from './site-info.service';
import { SiteInfo } from './site-info';

@Component({
    selector: 'app-site-info-index',
    templateUrl: './site-info-index.component.html',
    styles: []
})
export class SiteInfoIndexComponent implements OnInit {

    siteInfos$: Observable<SiteInfo[]>;
    titre = 'Liste des sites';

    constructor(
        protected service: SiteInfoService
    ) {
    }

    ngOnInit() {
        this.siteInfos$ = this.service.liste()
            .pipe(take(1))
            .pipe(map(
                apiResult => {
                    if (apiResult.statusCode === 200) {
                        const lecture = (apiResult as ApiResult200Ok<SiteInfo[]>).lecture;
                        if (lecture) {
                            return lecture;
                        }
                    }
                    return [];
                }
            ));
    }

}
