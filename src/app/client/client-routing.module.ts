import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPages } from './client-pages';
import { CAccueilComponent } from './c-accueil.component';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { CProduitsComponent } from './c-produits.component';
import { SiteOuvertGarde, EtatSiteChangeGarde } from '../securite/site-ouvert-garde';
import { CatalogueResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: ClientPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: ClientPages.accueil.urlSegment,
        component: CAccueilComponent,
        canActivate: [
            EtatSiteChangeGarde,
        ],
    },
    {
        path: ClientPages.produits.urlSegment,
        component: CProduitsComponent,
        canActivate: [
            SiteOuvertGarde,
        ],
        resolve: {
            catalogue: CatalogueResolverService,
        },
    },
    {
        path: ClientPages.commandes.urlSegment,
        loadChildren: () => import('./commandes/commander.module').then(mod => mod.CommanderModule),
    },
    {
        path: ClientPages.documents.urlSegment,
        loadChildren: () => import('./documents/c-document.module').then(mod => mod.CDocumentModule),
    },
    {
        path: AppPages.compte.urlSegment,
        loadChildren: () => import('../compte/compte.module').then(mod => mod.CompteModule)
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
