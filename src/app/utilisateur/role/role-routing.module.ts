import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleIndexComponent } from './role-index.component';
import { RoleApiRoutes } from './role-api-routes';
import { RoleAjouteComponent } from './role-ajoute.component';
import { RoleResolverService } from './role-resolver.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: RoleIndexComponent
            },
            {
                path: RoleApiRoutes.App.ajoute,
                component: RoleAjouteComponent,
            },
            {
                path: RoleApiRoutes.App.edite,
                component: RoleAjouteComponent,
                resolve: {
                    key: RoleResolverService,
                }
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule { }
