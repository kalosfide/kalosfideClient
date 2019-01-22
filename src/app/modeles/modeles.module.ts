import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { ProduitService } from './produit.service';
import { CategorieService } from './categorie.service';
import { SiteService } from './site.service';
import { SiteProduitsResolverService } from './site-produits-resolver.service';
import { SiteCategoriesResolverService } from './site-categories-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
    ],
    declarations: [
    ],
    providers: [
        SiteService,
        CategorieService,
        ProduitService,
        SiteProduitsResolverService,
        SiteCategoriesResolverService,
    ],
})
export class ModelesModule { }
