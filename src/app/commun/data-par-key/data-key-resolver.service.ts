import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { DataKeyService } from './data-key.service';
import { DataKey } from './data-key';
import { DataResolverService } from 'src/app/services/data-resolver.service';

export abstract class DataKeyResolverService<T extends DataKey> extends DataResolverService {
    abstract service: DataKeyService<T>;

    résoudObjet(route: ActivatedRouteSnapshot, key: DataKey): Observable<T> {
        return this.service.objet<T>(this.service.lit(key));
    }

    résoudListe(route: ActivatedRouteSnapshot, key: DataKey): Observable<T[]> {
        return this.service.objet<T[]>(this.service.liste(key));
    }

}
