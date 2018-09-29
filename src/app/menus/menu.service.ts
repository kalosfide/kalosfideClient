import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdentificationService } from '../securite/identification.service';
import { IMenu } from './imenu';
import { VisiteurMenu, SansRoleMenu } from './menu';

@Injectable()
export class MenuService {

    menu: IMenu;

    constructor(
        private identification: IdentificationService
    ) {
        this.identification.changementDIdentifiant().subscribe(
            c => {
                    console.log(c);
                if (this.identification.estAnonyme) {
                    this.menu = VisiteurMenu;
                } else {
                    const identifiant = this.identification.litIdentifiant();
                    console.log(identifiant);
                    return of(SansRoleMenu);
                }
            });
    }

    menu$(): Observable<IMenu> {
        return of(this.menu);
    }
}
