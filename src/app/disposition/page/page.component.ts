import { Component, OnInit } from '@angular/core';
import { IMenu } from '../../menus/imenu';
import { IdentificationService } from '../../s\u00E9curit\u00E9/identification.service';
import { SansRoleMenu, VisiteurMenu, AdministrateurMenu, ClientMenu, FournisseurMenu } from '../../menus/menu';
import { RevendicationsUtilisateur } from '../../s\u00E9curit\u00E9/identifiant';
import { TypeRole } from '../../sécurité/type-role';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styles: []
})
export class PageComponent implements OnInit {

    menu: IMenu;

    constructor(
        private titleService: Title,
        private identification: IdentificationService
    ) {
    }

    ngOnInit() {
        this.menu = VisiteurMenu;
        this.identification.changementDIdentifiant().subscribe(
            c => {
                if (!c) {
                    this.menu = VisiteurMenu;
                } else {
                    const identifiant = this.identification.litIdentifiant();
                    const revendications: RevendicationsUtilisateur = identifiant.revendications;
                    if (revendications.roleNo === 0) {
                        this.menu = SansRoleMenu;
                    } else {
                        switch (revendications.typeRole) {
                            case TypeRole.administrateur.code:
                                this.menu = AdministrateurMenu;
                                break;
                            case TypeRole.fournisseur.code:
                                this.menu = FournisseurMenu;
                                break;
                            case TypeRole.client.code:
                                this.menu = ClientMenu;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        );
    }

}
