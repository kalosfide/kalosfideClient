import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { FactureRoutingModule } from './facture-routing.module';
import { FactureComponent } from './facture.component';
import { FactureStockResolverService } from './facture-stock-resolver.service';
import { FactureClientsComponent } from './facture-clients.component';
import { FactureCommandesComponent } from './facture-commandes.component';
import { FactureCommandeComponent } from './facture-commande.component';
import { FactureCommandeResolverService } from './facture-commande-resolver.service';
import { FactureClientComponent } from './facture-client.component';
import { FactureProduitsComponent } from './facture-produits.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        FactureRoutingModule
    ],
    declarations: [
        FactureComponent,
        FactureClientsComponent,
        FactureClientComponent,
        FactureCommandesComponent,
        FactureCommandeComponent,
        FactureProduitsComponent,
    ],
    providers: [
        FactureStockResolverService,
        FactureCommandeResolverService,
    ]
})
export class FactureModule { }
