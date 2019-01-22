import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommandeLigne } from './commande-ligne';

@Injectable()
export class CommandeLigneResolverService implements Resolve<CommandeLigne> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<CommandeLigne> {
        const lignes: CommandeLigne[] = route.parent.data['lignes'];
        return of(lignes.find(l => l.no2 === +route.paramMap.get('no')));
    }

}
