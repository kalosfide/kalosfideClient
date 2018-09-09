import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisiteurIndexComponent } from './visiteur-index/visiteur-index.component';
import { ContactComponent } from './contact/contact.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { VisiteurApiRoutes } from './visiteur-api-routes';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: VisiteurIndexComponent
            },
            {
                path: VisiteurApiRoutes.App.contact,
                component: ContactComponent
            },
            {
                path: VisiteurApiRoutes.App.apropos,
                component: AProposComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisiteurRoutingModule { }
