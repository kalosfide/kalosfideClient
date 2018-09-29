import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { ClientRoutingModule } from './client-routing.module';
import { ClientIndexComponent } from './client-index/client-index.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ClientRoutingModule
    ],
    declarations: [
        ClientIndexComponent,
    ]
})
export class ClientModule { }
