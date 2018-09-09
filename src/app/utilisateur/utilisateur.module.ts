import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpersModule } from '../helpers/helpers.module';


import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurIndexComponent } from './index/utilisateur-index.component';


@NgModule({
    imports: [
        CommonModule,
        HelpersModule,
        UtilisateurRoutingModule
    ],
    declarations: [
        UtilisateurIndexComponent,
    ],
})
export class UtilisateurModule { }
