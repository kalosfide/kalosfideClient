import { Component, OnInit } from '@angular/core';
import { IdentificationService } from '../../sécurité/identification.service';
import { IItemDeMenu } from '../../menus/imenu';

@Component({
    selector: 'app-menu-connection',
    templateUrl: './menu-connection.component.html',
    styles: []
})
export class MenuConnectionComponent implements OnInit {

    items: IItemDeMenu[];

    constructor(
        private service: IdentificationService
    ) { }

    ngOnInit() {
        if (this.service.estIdentifié()) {
            this.items = [
                {
                    route: '/compte/deconnection',
                    texte: 'Déconnection',
                }
            ];
        } else {
            this.items = [
                {
                    texte: 'Connection',
                    nom: 'connection',
                    sousMenu: [
                        {
                            route: '/compte/enregistrement',
                            texte: 'Enregistrement',
                        },
                        {
                            route: '/compte/connection',
                            texte: 'Connection1',
                        }
                    ]
                }
            ];
        }
    }

}
