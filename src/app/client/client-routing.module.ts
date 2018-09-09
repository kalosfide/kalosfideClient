import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientIndexComponent } from './client-index/client-index.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ClientIndexComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
