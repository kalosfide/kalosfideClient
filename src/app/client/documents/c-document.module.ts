import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from 'src/app/commun/commun.module';
import { ModelesModule } from 'src/app/modeles/modeles.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { CDocumentRoutingModule } from './c-document-routing.module';
import { DocumentModule } from 'src/app/documents/document.module';
import { CDocumentLivraisonResolverService } from './c-document-livraison-resolver.service';
import { CDocumentCommandeResolverService } from './c-document-commande-resolver.service';
import { CDocumentFactureResolverService } from './c-document-facture-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        ModelesModule,
        DispositionModule,
        MessagesModule,
        DocumentModule,
        CDocumentRoutingModule,
    ],
    declarations: [
    ],
    providers: [
        CDocumentCommandeResolverService,
        CDocumentLivraisonResolverService,
        CDocumentFactureResolverService,
    ]
})
export class CDocumentModule { }
