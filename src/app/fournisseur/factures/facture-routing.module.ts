import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureComponent } from './facture.component';
import { FactureStockResolverService } from './facture-stock-resolver.service';
import { ClientsResolverService } from 'src/app/modeles/client/clients-resolver.service';
import { FactureClientsComponent } from './facture-clients.component';
import { ClientResolverService, ClientRésoluResolverService } from 'src/app/modeles/client/client-resolver.service';
import { FactureCommandeComponent } from './facture-commande.component';
import { FactureCommandesComponent } from './facture-commandes.component';
import { FactureCommandeResolverService } from './facture-commande-resolver.service';
import { FactureClientComponent } from './facture-client.component';
import { FactureProduitsComponent } from './facture-produits.component';

const routes: Routes = [
    {
        path: '',
        component: FactureComponent,
                resolve: {
                    stock: FactureStockResolverService,
                },
        children: [
            {
                path: '',
                redirectTo: FacturePages.clients.urlSegment,
                pathMatch: 'full',
            },
            {
                path: FacturePages.clients.urlSegment,
                component: FactureClientsComponent,
                resolve: {
                    stock: FactureStockResolverService,
                    clients: ClientsResolverService,
                },
            },
            {
                path: FacturePages.client.urlSegment + '/:key',
                component: FactureClientComponent,
                resolve: {
                    client: ClientResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: FacturePages.commandes.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        path: FacturePages.commandes.urlSegment,
                        component: FactureCommandesComponent,
                        resolve: {
                            stock: FactureStockResolverService,
                            client: ClientRésoluResolverService,
                        },
                    },
                    {
                        path: FacturePages.commande.urlSegment + '/:no',
                        component: FactureCommandeComponent,
                        resolve: {
                            stock: FactureStockResolverService,
                            commande: FactureCommandeResolverService,
                        },
                    },
                    {
                        path: FacturePages.facture.urlSegment,
                        component: FactureProduitsComponent,
                        resolve: {
                            stock: FactureStockResolverService,
                            client: ClientRésoluResolverService,
                        },
                    },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        {
            provide: 'termineResolver',
            useValue: () => true
        }
    ]
})
export class FactureRoutingModule { }
