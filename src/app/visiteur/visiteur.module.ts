import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { VisiteurRoutingModule } from './visiteur-routing.module';
import { VisiteurIndexComponent } from './visiteur-index/visiteur-index.component';
import { ContactComponent } from './contact/contact.component';
import { AProposComponent } from './a-propos/a-propos.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        VisiteurRoutingModule
    ],
    declarations: [
        VisiteurIndexComponent,
        ContactComponent,
        AProposComponent
    ]
})
export class VisiteurModule { }
