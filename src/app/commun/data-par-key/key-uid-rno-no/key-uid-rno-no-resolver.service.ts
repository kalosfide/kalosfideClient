import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { KeyUidRnoNo, GroupeUidRnoNo, IKeyUidRnoNoData } from './key-uid-rno-no';
import { DataKeyResolverService } from '../data-key-resolver.service';
import { KeyUidRno } from '../key-uid-rno/key-uid-rno';
import { map } from 'rxjs/operators';

export abstract class KeyUidRnoNoResolverService<T extends KeyUidRnoNo> extends DataKeyResolverService<T> {

    résoudNo(route: ActivatedRouteSnapshot, key: KeyUidRno): Observable<T> {
        return this.résoudObjet(route, {
            uid: key.uid,
            rno: key.rno,
            no: +route.paramMap.get('no')
        });
    }

    /**
     * résoud les listes groupées
     * @param route inutile
     * @param key keyParent du groupe
     * @param créeVue crée une donnée et y copie les champs hors clé
     */
    résoudGroupe<TGroupe extends GroupeUidRnoNo, TData extends IKeyUidRnoNoData>(
        route: ActivatedRouteSnapshot, key: KeyUidRno, créeVue: (data: TData) => T, apiAction: string
        ): Observable<T[]> {
        const apiResult$ = this.service.litGroupe<TGroupe>(key, apiAction);
        return this.service.objet<TGroupe>(apiResult$).pipe(
            map(g => g.liste.map(d => {
                const t = créeVue(d as TData);
                t.uid = key.uid;
                t.rno = key.rno;
                t.no = d.no;
                return t;
            }))
        );
    }

}
