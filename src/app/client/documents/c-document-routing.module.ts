import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CDocumentPages } from './c-document-pages';
import { DocumentsComponent } from 'src/app/documents/documents.component';
import { DocumentCommandeComponent } from 'src/app/documents/document-commande.component';
import { DocumentLivraisonComponent } from 'src/app/documents/document-livraison.component';
import { DocumentFactureComponent } from 'src/app/documents/document-facture.component';
import { DocumentPages } from 'src/app/documents/document-pages';
import { DocumentsResolverService } from 'src/app/documents/documents-resolver.service';
import { CDocumentCommandeResolverService } from './c-document-commande-resolver.service';
import { CDocumentLivraisonResolverService } from './c-document-livraison-resolver.service';
import { CDocumentFactureResolverService } from './c-document-facture-resolver.service';

const routes: Routes = [
    {
        path: '',
//        component: DocumentAccueilComponent,
        children: [
            {
                path: '',
                redirectTo: DocumentPages.liste.urlSegment,
                pathMatch: 'full',
            },
            {
                path: CDocumentPages.liste.urlSegment,
                component: DocumentsComponent,
                resolve: {
                    documents: DocumentsResolverService,
                },
            },
            {
                path: CDocumentPages.commande.urlSegment + '/:no',
                component: DocumentCommandeComponent,
                resolve: {
                    document: CDocumentCommandeResolverService,
                },
            },
            {
                path: CDocumentPages.livraison.urlSegment + '/:no',
                component: DocumentLivraisonComponent,
                resolve: {
                    document: CDocumentLivraisonResolverService,
                },
            },
            {
                path: CDocumentPages.facture.urlSegment + '/:no',
                component: DocumentFactureComponent,
                resolve: {
                    document: CDocumentFactureResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CDocumentRoutingModule { }
