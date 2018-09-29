import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurIndexComponent } from './fournisseur-index/fournisseur-index.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        FournisseurRoutingModule
    ],
    declarations: [
        FournisseurIndexComponent
    ]
})
export class FournisseurModule { }
