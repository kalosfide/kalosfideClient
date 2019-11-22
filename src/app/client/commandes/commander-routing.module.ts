import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommanderAccueilComponent } from './commander-accueil.component';
import { CommanderProduitResolverService } from './commander-produit-resolver.service';
import { CommandePages } from 'src/app/commandes/commande-pages';
import { CommanderCommandeComponent } from './commander-commande.component';
import { CommanderChoixProduitComponent } from './commander-choix-produit.component';
import { RetourneVraiResolverService } from 'src/app/services/retourne-vrai-resolver.service';
import { CommanderDetailAjouteComponent } from './commander-detail-ajoute.component';
import { CommanderDetailEditeComponent } from './commander-detail-edite.component';
import { CommanderDetailSupprimeComponent } from './commander-detail-supprime.component';
import { CommanderStockResolverService } from './commander-stock-resolver.service';
import { RedirigeSiContexteChangé, EffaceStockSiContexteChangé } from './contexte-change-garde';

const routes: Routes = [
    {
        path: '',
        component: CommanderAccueilComponent,
        children: [
            {
                path: '',
                redirectTo: CommandePages.liste.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CommandePages.liste.urlSegment,
                component: CommanderCommandeComponent,
                canActivate: [
                    EffaceStockSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                },
            },
            {
                path: CommandePages.choixProduit.urlSegment,
                component: CommanderChoixProduitComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                },
            },
            {
                path: CommandePages.ajoute.urlSegment + '/:no',
                component: CommanderDetailAjouteComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                    produit: CommanderProduitResolverService,
                },
            },
            {
                path: CommandePages.edite.urlSegment + '/:no',
                component: CommanderDetailEditeComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                    produit: CommanderProduitResolverService,
                },
            },
            {
                path: CommandePages.supprime.urlSegment + '/:no',
                component: CommanderDetailSupprimeComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                    produit: CommanderProduitResolverService,
                    suppression: RetourneVraiResolverService
                },
            },
            {
                path: CommandePages.efface.urlSegment,
                component: CommanderCommandeComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommanderRoutingModule { }
