import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CompteService } from '../compte.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { Subscription } from 'rxjs';
import { AppRoutes } from 'src/app/app-pages';
import { NavigationService } from 'src/app/services/navigation.service';
import { SiteRoutes } from 'src/app/site/site-pages';
import { RouteurService } from 'src/app/services/routeur.service';

@Component({
    selector: 'app-deconnection',
    templateUrl: './deconnection.component.html',
    styles: []
})
export class DeconnectionComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor(
        private routeur: RouteurService,
        private service: CompteService,
        private attenteAsync: AttenteAsyncService,
    ) { }

    ngOnInit() {
        this.attenteAsync.commence();
        this.subscription = this.service.déconnecte().subscribe(
            () => {
                this.attenteAsync.finit();
                this.routeur.navigue();
            },
            () => {
                this.attenteAsync.finit();
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
