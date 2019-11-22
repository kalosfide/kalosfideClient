import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { LivraisonRoutingModule } from './livraison-routing.module';
import { LivraisonComponent } from './livraison.component';
import { LivraisonCommandeBonComponent } from './livraison-commande-bon.component';
import { LivraisonProduitsComponent } from './livraison-produits.component';
import { LivraisonProduitComponent } from './livraison-produit.component';
import { LivraisonCommandesComponent } from './livraison-commandes.component';
import { LivraisonStockResolverService, LivraisonRésoluResolverService } from './livraison-stock-resolver.service';
import { LivraisonChoixProduitComponent } from './livraison-choix-produit.component';
import { LivraisonChoixClientComponent } from './livraison-choix-client.component';
import { LivraisonProduitResolverService, LivraisonProduitRésoluResolverService } from './livraison-produit-resolver.service';
import { LivraisonDetailAjouteComponent } from './livraison-detail-ajoute.component';
import { LivraisonDetailEditeComponent } from './livraison-detail-edite.component';
import { LivraisonDetailSupprimeComponent } from './livraison-detail-supprime.component';
import { LivraisonDetailProduitComponent } from './livraison-detail-produit.component';
import { LivraisonCommandeSupprimeComponent } from './livraison-commande-supprime.component';
import { LivraisonCommandeApercuComponent } from './livraison-commande-apercu.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        LivraisonRoutingModule
    ],
    declarations: [
        LivraisonComponent,
        LivraisonCommandesComponent,
        LivraisonCommandeBonComponent,
        LivraisonCommandeApercuComponent,
        LivraisonCommandeSupprimeComponent,
        LivraisonChoixProduitComponent,
        LivraisonChoixClientComponent,
        LivraisonDetailAjouteComponent,
        LivraisonDetailEditeComponent,
        LivraisonDetailSupprimeComponent,
        LivraisonProduitsComponent,
        LivraisonProduitComponent,
        LivraisonDetailProduitComponent,
    ],
    providers: [
        LivraisonStockResolverService,
        LivraisonRésoluResolverService,
        LivraisonProduitResolverService,
        LivraisonProduitRésoluResolverService,
    ]
})
export class LivraisonModule { }
