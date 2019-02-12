import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RacineComponent } from '../disposition/racine/racine.component';
import { AttenteAsyncService } from '../services/attenteAsync.service';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { AppSiteMenu } from './app-site-menu';
import { Menu } from '../disposition/menus/menu';
import { AlerteService } from '../disposition/alerte/alerte-service';

@Component({
    templateUrl: '../disposition/racine/racine.component.html',
})
export class AppSiteComponent extends RacineComponent implements OnInit, OnDestroy {

    constructor(
        protected titleService: Title,
        protected attenteAsyncService: AttenteAsyncService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
        protected alerteService: AlerteService,
    ) {
        super(
            titleService,
            attenteAsyncService,
            identification,
            navigation,
            alerteService,
        );
    }

    créeMenu(): Menu {
        return new AppSiteMenu();
    }

    ngOnInit() {
        this._ngOnInit();
        this.menu.créeItems();
        this.menu.rafraichit();
        this.subscriptions.push(this.identification.changementDIdentifiant().subscribe(() => this.identifiantChange()));
    }

}
