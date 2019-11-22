import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduitIndexComponent } from './produit-index.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitResolverService } from '../../modeles/catalogue/produit-resolver.service';
import { ProduitPrixComponent } from './produit-prix.component';
import { CategoriesResolverService } from 'src/app/modeles/catalogue/categories-resolver.service';
import { ProduitPages } from './produit-pages';
import { CatalogueResolverService, CatalogueRésoluResolverService } from 'src/app/modeles/catalogue/catalogue-resolver.service';
import { ProduitSitePasCatalogueGarde } from './produit-site-pas-catalogue-garde';
import { CatalogueComponent } from './catalogue.component';
import { NbCommandesOuvertesResolverService } from 'src/app/modeles/nb-commandes-ouvertes-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: CatalogueComponent,
        resolve: {
            nbCommandesOuvertes: NbCommandesOuvertesResolverService,
            catalogue: CatalogueResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: ProduitPages.index.urlSegment,
                pathMatch: 'full'
            },
            {
                path: ProduitPages.index.urlSegment,
                component: ProduitIndexComponent,
                resolve: {
                    catalogue: CatalogueRésoluResolverService,
                }
            },
            {
                path: ProduitPages.ajoute.urlSegment,
                component: ProduitAjouteComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    categories: CategoriesResolverService,
                }
            },
            {
                path: ProduitPages.edite.urlSegment + '/:no',
                component: ProduitEditeComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: ProduitResolverService,
                    categories: CategoriesResolverService,
                }
            },
            {
                path: ProduitPages.prix.urlSegment + '/:no',
                component: ProduitPrixComponent,
                canActivate: [
                    ProduitSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: ProduitResolverService,
                    categories: CategoriesResolverService,
                }
            },
            {
                path: ProduitPages.categories.urlSegment,
                loadChildren: () => import('./categories/categorie.module').then(mod => mod.CategorieModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProduitRoutingModule { }
