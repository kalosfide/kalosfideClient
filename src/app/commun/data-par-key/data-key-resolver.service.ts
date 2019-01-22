import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { DataKeyService } from './data-key.service';
import { DataKey } from './data-key';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { Site } from 'src/app/modeles/site';
import { KeyUidRno } from './key-uid-rno/key-uid-rno';

export abstract class DataKeyResolverService<T extends DataKey> extends DataResolverService {
    abstract service: DataKeyService<T>;

    résoudObjet(route: ActivatedRouteSnapshot, key: DataKey): Observable<T> {
        return this.objet<T>(this.service.lit(key));
    }

    résoudListe(route: ActivatedRouteSnapshot, key: DataKey): Observable<T[]> {
        return this.objet<T[]>(this.service.liste(key));
    }

    siteEnCours(route: ActivatedRouteSnapshot): Site {
        const fromRoot = route.pathFromRoot;
        for (let index = 0; index < fromRoot.length; index++) {
            const r = fromRoot[index];
            if (r.data.site) {
                return r.data.site;
            }
        }
    }

    keySiteEnCours(route: ActivatedRouteSnapshot): KeyUidRno {
        const site = this.siteEnCours(route);
        if (site) {
            return {
                uid: site.uid,
                rno: site.rno
            };
        }
    }

}
