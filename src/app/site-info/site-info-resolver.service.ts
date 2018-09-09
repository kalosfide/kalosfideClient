import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SiteInfoService } from './site-info.service';
import { SiteInfo } from './site-info';
import { HelpersService } from '../helpers/helpers.service';
import { ApiResult } from '../helpers/api-results/api-result';
import { ApiResult200Ok } from '../helpers/api-results/api-result-200-ok';

@Injectable()
export class SiteInfoResolverService implements Resolve<SiteInfo> {

    constructor(
        private service: SiteInfoService,
        private helpersService: HelpersService,
        private router: Router) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SiteInfo> {
        const ids = route.paramMap.get('id');
        const id = Number.parseInt(ids);
        if (!id) {
            this.helpersService.erreurDeRoute = this.router.url;
            this.router.navigate(this.helpersService.routeAppIntrouvable);
            return new Observable(null);
        }
        return this.service.lit(id).pipe(take(1), map(
            (apiResult: ApiResult) => {
                if (apiResult.statusCode === 200) {
                    return (apiResult as ApiResult200Ok<SiteInfo>).lecture;
                } else {
                    this.helpersService.erreurDeRoute = this.router.url;
                    this.router.navigate(this.helpersService.routeAppIntrouvable);
                    return null;
                }
            }
        ));
    }

}
