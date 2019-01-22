import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';

import { VAccueilComponent } from './v-accueil.component';
import { VContactComponent } from './v-contact.component';
import { DispositionModule } from '../disposition/disposition.module';
import { VisiteurRoutingModule } from './visiteur-routing.module';
import { VAProposComponent } from './v-apropos.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientService } from './devenir-client/devenir-client.service';
import { VProduitsComponent } from './v-produits.component';
import { CompteModule } from '../compte/compte.module';
import { MessagesModule } from '../messages/messages.module';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        MessagesModule,
        CompteModule,
        VisiteurRoutingModule,
    ],
    declarations: [
        VAccueilComponent,
        VProduitsComponent,
        VContactComponent,
        VAProposComponent,
        DevenirClientComponent,
    ],
    providers: [
        DevenirClientService
    ],
})
export class VisiteurModule { }
