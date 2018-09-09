import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleIndexComponent } from './role-index.component';
import { RoleApiRoutes } from './role-api-routes';
import { RoleAjouteComponent } from './role-ajoute.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: RoleIndexComponent
            },
            {
                path: RoleApiRoutes.Route(RoleApiRoutes.App.ajoute),
                component: RoleAjouteComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule { }
