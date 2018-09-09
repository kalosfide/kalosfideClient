import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpersModule } from '../helpers/helpers.module';
import { DispositionModule } from '../disposition/disposition.module';

import { ClientRoutingModule } from './client-routing.module';
import { ClientIndexComponent } from './client-index/client-index.component';

@NgModule({
    imports: [
        CommonModule,
        HelpersModule,
        DispositionModule,
        ClientRoutingModule
    ],
    declarations: [
        ClientIndexComponent,
    ]
})
export class ClientModule { }
