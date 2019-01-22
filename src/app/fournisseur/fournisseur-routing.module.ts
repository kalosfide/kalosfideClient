import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPages } from './fournisseur-pages';
import { FAccueilComponent } from './f-accueil.component';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { FCommandeComponent } from './f-commandes/f-commande.component';
import { FSiteOuvertureComponent } from './f-sites/f-site-ouverture.component';
import { FCommandeResolverService } from './f-commandes/f-commande-resolver.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: FournisseurPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: FournisseurPages.accueil.urlSegment,
        component: FAccueilComponent,
    },
    {
        path: FournisseurPages.produits.urlSegment,
        loadChildren: './produits/produit.module#ProduitModule'
    },
    {
        path: FournisseurPages.commandes.urlSegment,
        component: FCommandeComponent,
        resolve: {
            commandes: FCommandeResolverService,
        }
    },
    {
        path: FournisseurPages.site.urlSegment,
        component: FSiteOuvertureComponent,
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
export class FournisseurRoutingModule { }
