import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { IMenu } from '../../menus/imenu';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { IdentificationService } from '../../securite/identification.service';
import { SansRoleMenu, VisiteurMenu, AdministrateurMenu, ClientMenu, FournisseurMenu } from '../../menus/menu';
import { RevendicationsUtilisateur } from '../../securite/identifiant';
import { TypeRole } from '../../securite/type-role';
import { AnimeAttente } from '../../commun/anime-attente/anime-attente';

@Component({
    selector: 'app-disposition',
    templateUrl: './disposition.component.html',
    styles: []
})
export class DispositionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];

    menu: IMenu;
    animeAttente: AnimeAttente;

    constructor(
        private attenteAsyncService: AttenteAsyncService,
        private identification: IdentificationService,
    ) {
    }

    ngOnInit() {
        this.animeAttente = new AnimeAttente();
        this.subscriptions.push(this.attenteAsyncService.attenteAsync$().subscribe(
            attenteAsync => {
                if (attenteAsync) {
                    this.animeAttente.commence();
                } else {
                    this.animeAttente.finit();
                }
            }
        ));
        this.menu = VisiteurMenu;
        this.subscriptions.push(this.identification.changementDIdentifiant().subscribe(
            c => {
                if (!c) {
                    this.menu = VisiteurMenu;
                } else {
                    const identifiant = this.identification.litIdentifiant();
                    const revendications: RevendicationsUtilisateur = identifiant.revendications;
                    if (revendications.rono === 0) {
                        this.menu = SansRoleMenu;
                    } else {
                        switch (revendications.tyro) {
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
        ));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
