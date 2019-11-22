import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { AttenteService } from '../../services/attente.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Menu } from 'src/app/disposition/menu/menu';
import { IdentificationService } from 'src/app/securite/identification.service';
import { Title } from '@angular/platform-browser';
import { AppSite } from 'src/app/app-site/app-site';
import { Identifiant } from 'src/app/securite/identifiant';
import { AlerteService } from 'src/app/disposition/alerte/alerte-service';
import { AlerteConnection } from '../alerte/alerte-connection';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from '../fabrique/fabrique';

export abstract class RacineComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    animeAttente: KfGroupe;

    menu: Menu;
    abstract créeMenu(): Menu;

    constructor(
        protected titleService: Title,
        protected attenteService: AttenteService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
        protected alerteService: AlerteService,
    ) {
    }

    protected _ngOnInit() {
        this.animeAttente = Fabrique.animeAttenteGlobal(this.attenteService.enCours());

        this.subscriptions.push(this.navigation.changementDePageDef().subscribe(() => this.pageDefChange()));

        this.menu = this.créeMenu();
        this.menu.identifiant = this.identification.litIdentifiant();
    }

    protected utilisateurChange() {
        const identifiant: Identifiant = this.identification.litIdentifiant();
        this.menu.identifiant = identifiant;
        this.menu.rafraichit();
        this.alerteService.alertes = [AlerteConnection(identifiant)];
    }

    private pageDefChange() {
        let title = this.navigation.litSiteEnCours() ? this.navigation.litSiteEnCours().titre : AppSite.titre;
        for (let i = 0; i < this.navigation.pageDefs.length; i++) {
            title += ' - ' + this.navigation.pageDefs[i].title;
        }
        this.titleService.setTitle(title);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
