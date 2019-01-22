import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandePages } from './commande-pages';
import { CommandeRacineResolverService } from './commande-racine-resolver.service';
import { CommandeEnvoiComponent } from './commande-envoi.component';
import { CommandeProduitsComponent } from './commande-produits.component';
import { CommandeEnfantResolverService } from './commande-enfant-resolver.service';
import { CommandeTermineComponent } from './commande-termine.component';
import { CommandeCategoriesResolverService } from './commande-categories-resolver.service';
import { PeutQuitterGarde } from '../../commun/peut-quitter/peut-quitter-garde.service';
import { SiteOuvertGarde } from 'src/app/securite/site-ouvert-garde';

const routes: Routes = [
    {
        path: '',
        canActivateChild: [SiteOuvertGarde],
        resolve: {
            commande: CommandeRacineResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: CommandePages.envoi.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CommandePages.envoi.urlSegment,
                component: CommandeEnvoiComponent,
                resolve: {
                    commande: CommandeEnfantResolverService,
                },
                canDeactivate: [PeutQuitterGarde]
            },
            {
                path: CommandePages.produits.urlSegment,
                component: CommandeProduitsComponent,
                resolve: {
                    commande: CommandeEnfantResolverService,
                    categories: CommandeCategoriesResolverService,
                },
                canDeactivate: [PeutQuitterGarde]
            },
            {
                path: CommandePages.termine.urlSegment,
                component: CommandeTermineComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommandeRoutingModule { }
