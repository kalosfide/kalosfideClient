import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitePages } from './site-pages';
import { SiteResolverService } from './site-resolver.service';
import { VisiteurRacineComponent } from './visiteur-racine-component';
import { FournisseurRacineComponent } from './fournisseur-racine-component';
import { ClientRacineComponent } from './client-racine-component';
import { FournisseurGarde } from '../securite/fournisseur-garde';
import { ClientGarde } from '../securite/client-garde';

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
                loadChildren: () => import('../visiteur/visiteur.module').then(mod => mod.VisiteurModule)
            },
            {
                path: SitePages.fournisseur.urlSegment,
                component: FournisseurRacineComponent,
                canActivateChild: [FournisseurGarde],
                loadChildren: () => import('../fournisseur/fournisseur.module').then(mod => mod.FournisseurModule)
            },
            {
                path: SitePages.client.urlSegment,
                component: ClientRacineComponent,
                canActivateChild: [ClientGarde],
                loadChildren: () => import('../client/client.module').then(mod => mod.ClientModule)
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SiteRoutingModule { }
