import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPages } from './fournisseur-pages';
import { FAccueilComponent } from './f-accueil.component';
import { AppPages } from '../app-pages';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';
import { SiteEditeComponent } from './f-site/site-edite.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: FournisseurPages.accueil.urlSegment,
                component: FAccueilComponent,
            },
            {
                path: FournisseurPages.produits.urlSegment,
                loadChildren: () => import('./produits/produit.module').then(mod => mod.ProduitModule)
            },
            {
                path: FournisseurPages.clients.urlSegment,
                loadChildren: () => import('./clients/client.module').then(mod => mod.ClientModule)
            },
            {
                path: FournisseurPages.livraison.urlSegment,
                loadChildren: () => import('./livraisons/livraison.module').then(mod => mod.LivraisonModule)
            },
            {
                path: FournisseurPages.factures.urlSegment,
                loadChildren: () => import('./factures/facture.module').then(mod => mod.FactureModule)
            },
            {
                path: FournisseurPages.documents.urlSegment,
                loadChildren: () => import('./documents/f-document.module').then(mod => mod.FDocumentModule),
            },
            {
                path: FournisseurPages.site.urlSegment,
                component: SiteEditeComponent,
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
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FournisseurRoutingModule { }
