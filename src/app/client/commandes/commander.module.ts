import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { CommanderRoutingModule } from './commander-routing.module';
import { CommanderService } from './commander.service';
import { CommanderAccueilComponent } from './commander-accueil.component';
import { CommanderChoixProduitComponent } from './commander-choix-produit.component';
import { CommanderCommandeComponent } from './commander-commande.component';
import { CommanderProduitResolverService } from './commander-produit-resolver.service';
import { CommanderDetailAjouteComponent } from './commander-detail-ajoute.component';
import { CommanderDetailEditeComponent } from './commander-detail-edite.component';
import { CommanderDetailSupprimeComponent } from './commander-detail-supprime.component';
import { CommanderSupprimeComponent } from './commander-supprime.component';
import { EffaceStockSiContexteChangé, RedirigeSiContexteChangé } from './contexte-change-garde';
import { CommanderStockResolverService } from './commander-stock-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CommanderRoutingModule,
    ],
    declarations: [
        CommanderAccueilComponent,
        CommanderCommandeComponent,
        CommanderSupprimeComponent,
        CommanderChoixProduitComponent,
        CommanderDetailAjouteComponent,
        CommanderDetailEditeComponent,
        CommanderDetailSupprimeComponent,
    ],
    providers: [
        CommanderService,
        EffaceStockSiContexteChangé,
        RedirigeSiContexteChangé,
        CommanderStockResolverService,
        CommanderProduitResolverService,
    ],
})
export class CommanderModule { }
