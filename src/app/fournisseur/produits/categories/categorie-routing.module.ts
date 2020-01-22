import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePages } from './categorie-pages';
import { CategorieIndexComponent } from './categorie-index.component';
import { CategorieAjouteComponent } from './categorie-ajoute.component';
import { CategorieEditeComponent } from './categorie-edite.component';
import { CategorieResolverService } from '../../../modeles/catalogue/categorie-resolver.service';
import { CategoriesResolverService } from 'src/app/modeles/catalogue/categories-resolver.service';
import { CategorieSitePasCatalogueGarde } from './categorie-site-pas-catalogue-garde';
import { CategorieSupprimeComponent } from './categorie-supprime.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: CategoriePages.index.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CategoriePages.index.urlSegment,
                component: CategorieIndexComponent,
                resolve: {
                    liste: CategoriesResolverService,
                }
            },
            {
                path: CategoriePages.ajoute.urlSegment,
                component: CategorieAjouteComponent,
                canActivate: [
                    CategorieSitePasCatalogueGarde,
                ],
            },
            {
                path: CategoriePages.edite.urlSegment + '/:no',
                component: CategorieEditeComponent,
                canActivate: [
                    CategorieSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: CategorieResolverService,
                }
            },
            {
                path: CategoriePages.supprime.urlSegment + '/:no',
                component: CategorieSupprimeComponent,
                canActivate: [
                    CategorieSitePasCatalogueGarde,
                ],
                resolve: {
                    valeur: CategorieResolverService,
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategorieRoutingModule { }
