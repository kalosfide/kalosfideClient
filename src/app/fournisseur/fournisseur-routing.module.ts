import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurIndexComponent } from './fournisseur-index/fournisseur-index.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: FournisseurIndexComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FournisseurRoutingModule { }
