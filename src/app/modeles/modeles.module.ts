import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { SiteService } from './site.service';
import { ClientService } from './clientele/client.service';
import { ClientResolverService, ClientRésoluResolverService } from './clientele/client-resolver.service';
import { ClientsResolverService, ClientsRésoluResolverService } from './clientele/clients-resolver.service';
import { CatalogueModule } from './catalogue/modeles.module';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        CatalogueModule,
    ],
    declarations: [
    ],
    providers: [
        SiteService,
        ClientService,
        ClientResolverService,
        ClientRésoluResolverService,
        ClientsResolverService,
        ClientsRésoluResolverService,
    ],
    exports: [
        CatalogueModule
    ]
})
export class ModelesModule { }
