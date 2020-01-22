import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { FDocumentRoutingModule } from './f-document-routing.module';
import { DocumentModule } from 'src/app/documents/document.module';
import { FDocumentCommandeResolverService } from './f-document-commande-resolver.service';
import { FDocumentLivraisonResolverService } from './f-document-livraison-resolver.service';
import { FDocumentFactureResolverService } from './f-document-facture-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        DocumentModule,
        FDocumentRoutingModule,
    ],
    declarations: [
    ],
    providers: [
        FDocumentCommandeResolverService,
        FDocumentLivraisonResolverService,
        FDocumentFactureResolverService,
    ]
})
export class FDocumentModule { }
