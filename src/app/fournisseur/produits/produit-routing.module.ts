import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduitIndexComponent } from './produit-index.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitResolverService } from './produit-resolver.service';
import { ProduitPrixComponent } from './produit-prix.component';
import { SitePasOuvertGarde } from '../../securite/site-pas-ouvert-garde';
import { ProduitAccueilComponent } from './produit-accueil.component';
import { SiteProduitsResolverService } from 'src/app/modeles/site-produits-resolver.service';
import { ProduitPrixResolverService } from './produit-prix-resolver.service';
import { SiteCategoriesResolverService } from 'src/app/modeles/site-categories-resolver.service';
import { FProduitsComponent } from './F-produits.component';
import { ProduitPages } from './produit-pages';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: ProduitPages.accueil.urlSegment,
                pathMatch: 'full'
            },
            {
                path: ProduitPages.accueil.urlSegment,
                component: ProduitAccueilComponent,
            },
            {
                path: ProduitPages.visite.urlSegment,
                component: FProduitsComponent,
                resolve: {
                    liste: SiteProduitsResolverService,
                    categories: SiteCategoriesResolverService,
                },
            },
            {
                path: ProduitPages.index.urlSegment,
                component: ProduitIndexComponent,
                canActivate: [
                    SitePasOuvertGarde,
                ],
                resolve: {
                    liste: SiteProduitsResolverService,
                    categories: SiteCategoriesResolverService,
                }
            },
            {
                path: ProduitPages.ajoute.urlSegment,
                component: ProduitAjouteComponent,
                canActivate: [
                    SitePasOuvertGarde,
                ],
                resolve: {
                    categories: SiteCategoriesResolverService,
                }
            },
            {
                path: ProduitPages.edite.urlSegment + '/:no',
                component: ProduitEditeComponent,
                canActivate: [
                    SitePasOuvertGarde,
                ],
                resolve: {
                    valeur: ProduitResolverService,
                    categories: SiteCategoriesResolverService,
                }
            },
            {
                path: ProduitPages.prix.urlSegment + '/:no',
                canActivate: [
                    SitePasOuvertGarde,
                ],
                component: ProduitPrixComponent,
                resolve: {
                    valeur: ProduitPrixResolverService,
                }
            },
            {
                path: ProduitPages.categories.urlSegment,
                canActivateChild: [
                    SitePasOuvertGarde,
                ],
                loadChildren: './categories/categorie.module#CategorieModule'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProduitRoutingModule { }
