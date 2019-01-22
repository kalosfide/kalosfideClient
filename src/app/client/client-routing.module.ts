import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientRacineComponent } from '../site/client-racine-component';
import { ClientPages } from './client-pages';
import { CAccueilComponent } from './c-accueil.component';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { CProduitsComponent } from './c-produits.component';
import { SiteOuvertGarde } from '../securite/site-ouvert-garde';
import { SiteProduitsResolverService } from '../modeles/site-produits-resolver.service';
import { SiteCategoriesResolverService } from '../modeles/site-categories-resolver.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: ClientPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: ClientPages.accueil.urlSegment,
        component: CAccueilComponent,
    },
    {
        path: ClientPages.produits.urlSegment,
        component: CProduitsComponent,
        resolve: {
            liste: SiteProduitsResolverService,
            categories: SiteCategoriesResolverService,
        },
        canActivate: [SiteOuvertGarde]
    },
    {
        path: ClientPages.commandes.urlSegment,
        loadChildren: './commandes/commande.module#CommandeModule'
    },
    {
        path: AppPages.compte.urlSegment,
        loadChildren: '../compte/compte.module#CompteModule'
    },
    // pages d'erreur
    {
        path: AppPages.interdit.urlSegment,
        component: PageInterditeComponent
    },
    {
        path: AppPages.conflit.urlSegment,
        component: PageConflitComponent
    },
    {
        path: AppPages.apiErreur.urlSegment,
        component: PageErreurComponent,
    },
    {
        path: AppPages.introuvable.urlSegment,
        component: PageIntrouvableComponent,
    },
    {
        path: '**',
        redirectTo: AppPages.introuvable.urlSegment,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
