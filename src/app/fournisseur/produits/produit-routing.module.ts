import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduitPages, ProduitModifPages } from './produit-pages';
import { ProduitIndexComponent } from './produit-index.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitResolverService } from './produit-resolver.service';
import { ProduitPrixComponent } from './produit-prix.component';
import { SitePasOuvertGarde } from './site-pas-ouvert-garde';
import { ProduitAccueilComponent } from './produit-accueil.component';
import { SiteProduitsResolverService } from 'src/app/modeles/site-produits-resolver.service';
import { ProduitPrixResolverService } from './produit-prix-resolver.service';
import { SiteCategoriesResolverService } from 'src/app/modeles/site-categories-resolver.service';

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
                path: ProduitPages.modif.urlSegment,
                canActivateChild: [
                    SitePasOuvertGarde,
                ],
                children: [
                    {
                        path: '',
                        redirectTo: ProduitModifPages.index.urlSegment,
                        pathMatch: 'full'
                    },
                    {
                        path: ProduitModifPages.index.urlSegment,
                        component: ProduitIndexComponent,
                        resolve: {
                            liste: SiteProduitsResolverService,
                            categories: SiteCategoriesResolverService,
                        }
                    },
                    {
                        path: ProduitModifPages.ajoute.urlSegment,
                        component: ProduitAjouteComponent,
                        resolve: {
                            categories: SiteCategoriesResolverService,
                        }
                    },
                    {
                        path: ProduitModifPages.edite.urlSegment + '/:no',
                        component: ProduitEditeComponent,
                        resolve: {
                            valeur: ProduitResolverService,
                            categories: SiteCategoriesResolverService,
                        }
                    },
                    {
                        path: ProduitModifPages.prix.urlSegment + '/:no',
                        component: ProduitPrixComponent,
                        resolve: {
                            valeur: ProduitPrixResolverService,
                        }
                    },
                    {
                        path: ProduitModifPages.categories.urlSegment,
                        loadChildren: './categories/categorie.module#CategorieModule'
                    },
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProduitRoutingModule { }
