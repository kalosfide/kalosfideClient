import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurService } from './fournisseur.service';
import { FAccueilComponent } from './f-accueil.component';
import { MessagesModule } from '../messages/messages.module';
import { ModelesModule } from '../modeles/modeles.module';
import { FCommandeComponent } from './f-commandes/f-commande.component';
import { FSiteOuvertureComponent } from './f-site/f-site-ouverture.component';
import { FCommandeResolverService } from './f-commandes/f-commande-resolver.service';
import { FCommandeNbOuvertesResolverService } from './f-commandes/f-commande-nb-ouvertes-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        FournisseurRoutingModule
    ],
    declarations: [
        FAccueilComponent,
        FCommandeComponent,
        FSiteOuvertureComponent,
    ],
    providers: [
        FournisseurService,
        FCommandeResolverService,
        FCommandeNbOuvertesResolverService,
    ],
})
export class FournisseurModule { }
