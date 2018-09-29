import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UtilisateurIndexComponent } from './index/utilisateur-index.component';
import { UtilisateurApiRoutes } from './utilisateur-api-routes';
import { VisiteurExcluGuard } from '../securite/visiteur-exclu.guard';

const routes: Routes = [
    {
        path: '',
        canActivateChild: [VisiteurExcluGuard],
        children: [
            {
                path: '',
                component: UtilisateurIndexComponent
            },
            {
                path: UtilisateurApiRoutes.App.role,
                loadChildren: './role/role.module#RoleModule'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
