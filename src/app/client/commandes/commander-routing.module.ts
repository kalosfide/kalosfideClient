import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommanderAccueilComponent } from './commander-accueil.component';
import { CommanderProduitResolverService } from './commander-produit-resolver.service';
import { CommanderChoixProduitComponent } from './commander-choix-produit.component';
import { RetourneVraiResolverService } from 'src/app/services/retourne-vrai-resolver.service';
import { CommanderDetailAjouteComponent } from './commander-detail-ajoute.component';
import { CommanderDetailEditeComponent } from './commander-detail-edite.component';
import { CommanderDetailSupprimeComponent } from './commander-detail-supprime.component';
import { CommanderStockResolverService, CommanderStockBonResolverService } from './commander-stock-resolver.service';
import { RedirigeSiContexteChangé } from './contexte-change-garde';
import { CommanderPages } from './commander-pages';
import { CommanderCommandeBonComponent } from './commander-commande-bon.component copy';
import { CommanderCommandeAnnuleComponent } from './commander-commande-annule.component';

const routes: Routes = [
    {
        path: '',
        component: CommanderAccueilComponent,
        children: [
            {
                path: '',
                redirectTo: CommanderPages.liste.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CommanderPages.liste.urlSegment,
                component: CommanderCommandeBonComponent,
                resolve: {
                    stock: CommanderStockBonResolverService,
                },
            },
            {
                path: CommanderPages.choixProduit.urlSegment,
                component: CommanderChoixProduitComponent,
                canActivate: [
                    RedirigeSiContexteChangé,
                ],
                resolve: {
                    stock: CommanderStockResolverService,
                },
            },
            {
                path: CommanderPages.ajoute.urlSegment + '/:no',
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
                path: CommanderPages.edite.urlSegment + '/:no',
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
                path: CommanderPages.supprime.urlSegment + '/:no',
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
                path: CommanderPages.annule.urlSegment,
                component: CommanderCommandeAnnuleComponent,
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
