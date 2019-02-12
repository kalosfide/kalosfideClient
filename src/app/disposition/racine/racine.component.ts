import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { Subscription, Observable } from 'rxjs';


import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { AnimeAttente } from '../../commun/anime-attente/anime-attente';
import { NavigationService } from 'src/app/services/navigation.service';
import { Menu } from 'src/app/disposition/menus/menu';
import { IdentificationService } from 'src/app/securite/identification.service';
import { Title } from '@angular/platform-browser';
import { AppSite } from 'src/app/app-site/app-site';
import { Identifiant } from 'src/app/securite/identifiant';
import { AlerteService } from 'src/app/disposition/alerte/alerte-service';
import { Alerte, TypeAlerte } from 'src/app/disposition/alerte/alerte';
import { Site } from 'src/app/modeles/site';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { AlerteSiteFerme } from '../alerte/alerte-site-ferme';
import { AlerteConnection } from '../alerte/alerte-connection';

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
        protected alerteService: AlerteService,
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
        const identifiant: Identifiant = this.identification.litIdentifiant();
        this.menu.identifiant = identifiant;
        this.menu.rafraichit();
        const alertes: Alerte[] = [];
        if (identifiant) {
            alertes.push(AlerteConnection(identifiant));
            identifiant.sites.filter(s => s.uid === identifiant.uid && !s.ouvert).forEach(
                (site: Site) => {
                    alertes.push(AlerteSiteFerme(site));
                }
            );
        }
        this.alerteService.alertes = alertes;
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
