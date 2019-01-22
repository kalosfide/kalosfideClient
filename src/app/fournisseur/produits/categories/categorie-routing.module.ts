import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePages } from './categorie-pages';
import { CategorieIndexComponent } from './categorie-index.component';
import { CategorieAjouteComponent } from './categorie-ajoute.component';
import { CategorieEditeComponent } from './categorie-edite.component';
import { CategorieResolverService } from './categorie-resolver.service';
import { SiteCategoriesResolverService } from 'src/app/modeles/site-categories-resolver.service';
import { SiteRoleGarde } from 'src/app/securite/site-role-garde';

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
                    liste: SiteCategoriesResolverService,
                }
            },
            {
                path: CategoriePages.ajoute.urlSegment,
                component: CategorieAjouteComponent,
                canActivate: [SiteRoleGarde],
            },
            {
                path: CategoriePages.edite.urlSegment + '/:no',
                component: CategorieEditeComponent,
                canActivate: [SiteRoleGarde],
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
