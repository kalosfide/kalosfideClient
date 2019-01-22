import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitePages } from './site-pages';
import { SiteResolverService } from './site-resolver.service';
import { VisiteurRacineComponent } from './visiteur-racine-component';
import { FournisseurRacineComponent } from './fournisseur-racine-component';
import { ClientRacineComponent } from './client-racine-component';

const routes: Routes = [
    {
        path: ':nomSite',
        resolve: {
            site: SiteResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: SitePages.visiteur.urlSegment,
                pathMatch: 'full',
            },
            {
                path: SitePages.visiteur.urlSegment,
                component: VisiteurRacineComponent,
                loadChildren: '../visiteur/visiteur.module#VisiteurModule'
            },
            {
                path: SitePages.fournisseur.urlSegment,
                component: FournisseurRacineComponent,
                loadChildren: '../fournisseur/fournisseur.module#FournisseurModule'
            },
            {
                path: SitePages.client.urlSegment,
                component: ClientRacineComponent,
                loadChildren: '../client/client.module#ClientModule'
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SiteRoutingModule { }
