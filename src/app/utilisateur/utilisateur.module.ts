import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';


import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurIndexComponent } from './index/utilisateur-index.component';


@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        UtilisateurRoutingModule
    ],
    declarations: [
        UtilisateurIndexComponent,
    ],
})
export class UtilisateurModule { }
