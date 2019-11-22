import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientPages } from './client-pages';
import { ClientIndexComponent } from './client-index.component';
import { ClientAjouteComponent } from './client-ajoute.component';
import { ClientEditeComponent } from './client-edite.component';
import { ClientResolverService } from '../../modeles/clientele/client-resolver.service';
import { ClientsResolverService } from '../../modeles/clientele/clients-resolver.service';
import { ClientAccepteComponent } from './client-accepte.component';
import { ClientExclutComponent } from './client-exclut.component';
import { ClientSiteLivraisonGarde } from './client-site-livraison-garde';
import { ClientComponent } from './client.component';

const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        children: [
            {
                path: '',
                redirectTo: ClientPages.index.urlSegment,
                pathMatch: 'full',
            },
            {
                path: ClientPages.index.urlSegment,
                component: ClientIndexComponent,
                resolve: {
                    liste: ClientsResolverService,
                }
            },
            {
                path: ClientPages.ajoute.urlSegment,
                component: ClientAjouteComponent,
                canActivate: [
                    ClientSiteLivraisonGarde
                ],
            },
            {
                path: ClientPages.edite.urlSegment + '/:key',
                component: ClientEditeComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
                canActivate: [
                    ClientSiteLivraisonGarde
                ],
            },
            {
                path: ClientPages.accepte.urlSegment + '/:key',
                component: ClientAccepteComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
                canActivate: [
                    ClientSiteLivraisonGarde
                ],
            },
            {
                path: ClientPages.exclut.urlSegment + '/:key',
                component: ClientExclutComponent,
                resolve: {
                    valeur: ClientResolverService,
                },
                canActivate: [
                    ClientSiteLivraisonGarde
                ],
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
