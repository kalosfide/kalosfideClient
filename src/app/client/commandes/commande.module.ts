import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../../commun/commun.module';
import { DispositionModule } from '../../disposition/disposition.module';
import { CommandeRoutingModule } from './commande-routing.module';
import { CommandeService } from './commande.service';
import { CommandeRacineResolverService } from './commande-racine-resolver.service';
import { CommandeEnfantResolverService } from './commande-enfant-resolver.service';
import { CommandeLigneResolverService } from './commande-ligne-resolver.service';
import { CommandeEnvoiComponent } from './commande-envoi.component';
import { CommandeProduitsComponent } from './commande-produits.component';
import { CommandeTermineComponent } from './commande-termine.component';
import { CommandeCategoriesResolverService } from './commande-categories-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CommandeRoutingModule,
    ],
    declarations: [
        CommandeEnvoiComponent,
        CommandeProduitsComponent,
        CommandeTermineComponent,
    ],
    providers: [
        CommandeService,
        CommandeRacineResolverService,
        CommandeEnfantResolverService,
        CommandeCategoriesResolverService,
        CommandeLigneResolverService,
    ],
})
export class CommandeModule { }
