import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpersModule } from '../../helpers/helpers.module';

import { RoleRoutingModule } from './role-routing.module';
import { RoleIndexComponent } from './role-index.component';
import { RoleAjouteComponent } from './role-ajoute.component';
import { RoleService } from './role.service';

@NgModule({
    imports: [
        CommonModule,
        HelpersModule,
        RoleRoutingModule,
    ],
    declarations: [
        RoleIndexComponent,
        RoleAjouteComponent,
    ],
    providers: [
        RoleService,
    ]
})
export class RoleModule { }
