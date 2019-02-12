import { OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AttenteAsyncService } from '../services/attenteAsync.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { RacineComponent } from '../disposition/racine/racine.component';
import { ActivatedRoute } from '@angular/router';
import { Site } from '../modeles/site';
import { AlerteService } from '../disposition/alerte/alerte-service';

export abstract class SiteRacineComponent extends RacineComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
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

    ngOnInit() {
        this._ngOnInit();
        this.subscriptions.push(this.route.data.subscribe((data: { site: Site }) => {
            this.menu.site = data.site;
            this.menu.site = this.navigation.siteEnCours;
            this.menu.créeItems();
            this.menu.rafraichit();
            this.subscriptions.push(this.navigation.changementDeSite().subscribe(() => this.siteChange()));
            this.subscriptions.push(this.identification.changementDIdentifiant().subscribe(() => this.identifiantChange()));
        }));
    }

    private siteChange() {
        this.menu.site = this.navigation.siteEnCours;
        this.menu.rafraichit();
    }

}
