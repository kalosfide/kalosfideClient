import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AttenteAsyncService } from '../services/attenteAsync.service';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { FournisseurMenu } from '../fournisseur/fournisseur-menu';
import { ActivatedRoute } from '@angular/router';
import { Menu } from '../menus/menu';
import { SiteRacineComponent } from './site-racine.component';

@Component({
    templateUrl: '../disposition/racine/racine.component.html',
})
export class FournisseurRacineComponent extends SiteRacineComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected titleService: Title,
        protected attenteAsyncService: AttenteAsyncService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
    ) {
        super(
            route,
            titleService,
            attenteAsyncService,
            identification,
            navigation,
        );
    }

    créeMenu(): Menu {
        return new FournisseurMenu();
    }

}
