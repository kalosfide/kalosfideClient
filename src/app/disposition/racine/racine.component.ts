import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { Subscription, Observable } from 'rxjs';


import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { AnimeAttente } from '../../commun/anime-attente/anime-attente';
import { NavigationService } from 'src/app/services/navigation.service';
import { Menu } from 'src/app/menus/menu';
import { IdentificationService } from 'src/app/securite/identification.service';
import { Title } from '@angular/platform-browser';
import { AppSite } from 'src/app/app-site/app-site';
import { Identifiant } from 'src/app/securite/identifiant';

export abstract class RacineComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    animeAttente: AnimeAttente;

    menu: Menu;
    abstract créeMenu(): Menu;

    constructor(
        protected titleService: Title,
        protected attenteAsyncService: AttenteAsyncService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
    ) {
    }

    protected _ngOnInit() {
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

        this.subscriptions.push(this.navigation.changementDePageDef().subscribe(() => this.pageDefChange()));

        this.menu = this.créeMenu();
        this.menu.identifiant = this.identification.litIdentifiant();
    }

    protected identifiantChange() {
        const identifiant = this.identification.litIdentifiant();
        this.menu.identifiant = identifiant;
        this.menu.rafraichit();
        if (identifiant) {}
    }

    private pageDefChange() {
        let title = this.navigation.siteEnCours ? this.navigation.siteEnCours.titre : AppSite.titre;
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
