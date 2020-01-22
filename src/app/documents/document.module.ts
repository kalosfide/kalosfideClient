import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { DocumentService } from './document.service';
import { DocumentsComponent } from './documents.component';
import { DocumentCommandeComponent } from './document-commande.component';
import { DocumentLivraisonComponent } from './document-livraison.component';
import { DocumentFactureComponent } from './document-facture.component';
import { DocumentsResolverService } from './documents-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
    ],
    declarations: [
        DocumentsComponent,
        DocumentCommandeComponent,
        DocumentLivraisonComponent,
        DocumentFactureComponent,
    ],
    providers: [
        DocumentService,
        DocumentsResolverService,
    ],
    exports: [
        DocumentsComponent,
    ]
})
export class DocumentModule { }
