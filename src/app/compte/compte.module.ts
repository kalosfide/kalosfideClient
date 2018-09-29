import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { CompteRoutingModule } from './compte-routing.module';

import { EnregistrementComponent } from './enregistrement/enregistrement.component';
import { ConnectionComponent } from './connection/connection.component';
import { DeconnectionComponent } from './deconnection/deconnection.component';
import { UtilisateurService } from './services/utilisateur.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        CompteRoutingModule,
    ],
    declarations: [
        EnregistrementComponent,
        ConnectionComponent,
        DeconnectionComponent,
    ],
    providers: [
        UtilisateurService,
    ],
})
export class CompteModule { }
