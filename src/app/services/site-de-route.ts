import { ActivatedRouteSnapshot } from '@angular/router';
import { Site } from '../modeles/site';

export function SiteDeRoute(route: ActivatedRouteSnapshot): Site {
    const site = route.data['site'];
    if (site) {
        return site;
    }
    if (route.parent) {
        return SiteDeRoute(route.parent);
    }
}
