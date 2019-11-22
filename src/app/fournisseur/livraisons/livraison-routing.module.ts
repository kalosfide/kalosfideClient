import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LivraisonPages } from './livraison-pages';
import { LivraisonCommandeBonComponent } from './livraison-commande-bon.component';
import { LivraisonProduitsComponent } from './livraison-produits.component';
import { LivraisonProduitComponent } from './livraison-produit.component';
import { LivraisonCommandesComponent } from './livraison-commandes.component';
import { ClientsResolverService } from 'src/app/modeles/clientele/clients-resolver.service';
import { ClientResolverService, ClientRésoluResolverService } from 'src/app/modeles/clientele/client-resolver.service';
import { LivraisonStockResolverService } from './livraison-stock-resolver.service';
import { LivraisonComponent } from './livraison.component';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { LivraisonProduitResolverService, LivraisonProduitRésoluResolverService } from './livraison-produit-resolver.service';
import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonChoixClientComponent } from './livraison-choix-client.component';
import { LivraisonDetailAjouteComponent } from './livraison-detail-ajoute.component';
import { LivraisonDetailEditeComponent } from './livraison-detail-edite.component';
import { LivraisonDetailSupprimeComponent } from './livraison-detail-supprime.component';
import { LivraisonDetailProduitComponent } from './livraison-detail-produit.component';
import { LivraisonCommandeSupprimeComponent } from './livraison-commande-supprime.component';
import { LivraisonCommandeApercuComponent } from './livraison-commande-apercu.component';

const routes: Routes = [
    {
        path: '',
        component: LivraisonComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                },
        children: [
            {
                path: '',
                redirectTo: LivraisonPages.commandes.urlSegment,
                pathMatch: 'full',
            },
            {
                path: LivraisonPages.commandes.urlSegment,
                component: LivraisonCommandesComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    clients: ClientsResolverService,
                },
            },
            {
                path: LivraisonPages.choixClient.urlSegment,
                component: LivraisonChoixClientComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    clients: ClientsResolverService,
                },
            },
            {
                path: LivraisonPages.commande.urlSegment + '/:key',
                resolve: {
                    client: ClientResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: CommandePages.liste.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        path: CommandePages.liste.urlSegment,
                        component: LivraisonCommandeBonComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientRésoluResolverService,
                        },
                    },
                    {
                        path: CommandePages.choixProduit.urlSegment,
                        component: LivraisonChoixProduitComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientRésoluResolverService,
                        },
                    },
                    {
                        path: CommandePages.ajoute.urlSegment + '/:no',
                        component: LivraisonDetailAjouteComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientRésoluResolverService,
                            produit: LivraisonProduitResolverService,
                        },
                    },
                    {
                        path: CommandePages.edite.urlSegment + '/:no',
                        component: LivraisonDetailEditeComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientRésoluResolverService,
                            produit: LivraisonProduitResolverService,
                        },
                    },
                    {
                        path: CommandePages.supprime.urlSegment + '/:no',
                        component: LivraisonDetailSupprimeComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientRésoluResolverService,
                            produit: LivraisonProduitResolverService,
                        },
                    },
                ]
            },
            {
                path: LivraisonPages.efface.urlSegment + '/:key',
                component: LivraisonCommandeSupprimeComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    client: ClientResolverService,
                },
            },
            {
                path: LivraisonPages.apercu.urlSegment + '/:key',
                component: LivraisonCommandeApercuComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    client: ClientResolverService,
                },
            },
            {
                path: LivraisonPages.produits.urlSegment,
                component: LivraisonProduitsComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    clients: ClientsResolverService,
                },
            },
            {
                path: LivraisonPages.produit.urlSegment + '/:no',
                resolve: {
                    produit: LivraisonProduitResolverService,
                },
                children: [
                    {
                        path: '',
                        redirectTo: CommandePages.liste.urlSegment,
                        pathMatch: 'full',
                    },
                    {
                        path: CommandePages.liste.urlSegment,
                        component: LivraisonProduitComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            clients: ClientsResolverService,
                            produit: LivraisonProduitRésoluResolverService,
                        },
                    },
                    {
                        path: CommandePages.edite.urlSegment + '/:key',
                        component: LivraisonDetailProduitComponent,
                        resolve: {
                            stock: LivraisonStockResolverService,
                            client: ClientResolverService,
                            produit: LivraisonProduitRésoluResolverService,
                        },
                    },
                ],
            },
            {
                path: LivraisonPages.termine.urlSegment,
                component: LivraisonCommandesComponent,
                resolve: {
                    stock: LivraisonStockResolverService,
                    clients: ClientsResolverService,
                    termine: 'termineResolver',
                },
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
export class LivraisonRoutingModule { }
