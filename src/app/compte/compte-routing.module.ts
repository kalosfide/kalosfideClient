import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnregistrementComponent } from './enregistrement/enregistrement.component';
import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { CompteApiRoutes } from './compte-api-routes';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: CompteApiRoutes.App.gestion,
                pathMatch: 'full',

            },
            {
                path: CompteApiRoutes.App.gestion,
                loadChildren: './gestion/gestion.module#GestionModule'
            },
            {
                path: CompteApiRoutes.App.enregistrement,
                component: EnregistrementComponent
            },
            {
                path: CompteApiRoutes.App.connection,
                component: ConnectionComponent
            },
            {
                path: CompteApiRoutes.App.deconnection,
                component: DeconnectionComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompteRoutingModule { }
