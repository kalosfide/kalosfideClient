import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../../commun/commun.module';

import { RoleRoutingModule } from './role-routing.module';
import { RoleIndexComponent } from './role-index.component';
import { RoleAjouteComponent } from './role-ajoute.component';
import { RoleService } from './role.service';
import { RoleResolverService } from './role-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule, // provides RouteurService
        RoleRoutingModule, // imports RoutingModule, provides Router
    ],
    declarations: [
        RoleIndexComponent,
        RoleAjouteComponent,
    ],
    providers: [
        RoleService,
        RoleResolverService, // deps: [RoleService, RouteurService, Router]
    ]
})
export class RoleModule { }
