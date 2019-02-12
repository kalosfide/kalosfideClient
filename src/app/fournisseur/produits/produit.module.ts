import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ProduitRoutingModule } from './produit-routing.module';
import { ProduitIndexComponent } from './produit-index.component';
import { ProduitEditeComponent } from './produit-edite.component';
import { ProduitAjouteComponent } from './produit-ajoute.component';
import { ProduitResolverService } from './produit-resolver.service';
import { ProduitPrixComponent } from './produit-prix.component';
import { ProduitPrixResolverService } from './produit-prix-resolver.service';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { FProduitsComponent } from './F-produits.component';
import { ProduitAccueilComponent } from './produit-accueil.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
        ProduitRoutingModule,
    ],
    declarations: [
        ProduitAccueilComponent,
        ProduitAjouteComponent,
        ProduitEditeComponent,
        ProduitIndexComponent,
        ProduitPrixComponent,
        FProduitsComponent,
    ],
    providers: [
        ProduitResolverService,
        ProduitPrixResolverService,
    ],
})
export class ProduitModule { }
