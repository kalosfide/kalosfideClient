import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { CommanderRoutingModule } from './commander-routing.module';
import { CommanderService } from './commander.service';
import { CommanderAccueilComponent } from './commander-accueil.component';
import { CommanderChoixProduitComponent } from './commander-choix-produit.component';
import { CommanderProduitResolverService } from './commander-produit-resolver.service';
import { CommanderDetailAjouteComponent } from './commander-detail-ajoute.component';
import { CommanderDetailEditeComponent } from './commander-detail-edite.component';
import { CommanderDetailSupprimeComponent } from './commander-detail-supprime.component';
import { RedirigeSiContexteChangé } from './contexte-change-garde';
import { CommanderStockResolverService, CommanderStockBonResolverService } from './commander-stock-resolver.service';
import { CommanderCommandeBonComponent } from './commander-commande-bon.component copy';
import { CommanderCommandeContexteComponent } from './commander-commande-contexte.component';
import { CommanderCommandeAnnuleComponent } from './commander-commande-annule.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CommanderRoutingModule,
    ],
    declarations: [
        CommanderAccueilComponent,
        CommanderCommandeBonComponent,
        CommanderCommandeContexteComponent,
        CommanderCommandeAnnuleComponent,
        CommanderChoixProduitComponent,
        CommanderDetailAjouteComponent,
        CommanderDetailEditeComponent,
        CommanderDetailSupprimeComponent,
    ],
    providers: [
        CommanderService,
        RedirigeSiContexteChangé,
        CommanderStockResolverService,
        CommanderStockBonResolverService,
        CommanderProduitResolverService,
    ],
})
export class CommanderModule { }
