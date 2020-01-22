import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentPages } from 'src/app/documents/document-pages';
import { ClientsResolverService } from 'src/app/modeles/client/clients-resolver.service';
import { DocumentsComponent } from 'src/app/documents/documents.component';
import { DocumentCommandeComponent } from 'src/app/documents/document-commande.component';
import { DocumentLivraisonComponent } from 'src/app/documents/document-livraison.component';
import { DocumentFactureComponent } from 'src/app/documents/document-facture.component';
import { DocumentsResolverService } from 'src/app/documents/documents-resolver.service';
import { FDocumentCommandeResolverService } from './f-document-commande-resolver.service';
import { FDocumentLivraisonResolverService } from './f-document-livraison-resolver.service';
import { FDocumentFactureResolverService } from './f-document-facture-resolver.service';

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
                path: DocumentPages.liste.urlSegment,
                component: DocumentsComponent,
                resolve: {
                    documents: DocumentsResolverService,
                    clients: ClientsResolverService,
//                    filtre: DocumentFiltreResolverService
                },
            },
            {
                path: DocumentPages.commande.urlSegment + '/:key',
                component: DocumentCommandeComponent,
                resolve: {
                    document: FDocumentCommandeResolverService,
                },
            },
            {
                path: DocumentPages.livraison.urlSegment + '/:key',
                component: DocumentLivraisonComponent,
                resolve: {
                    document: FDocumentLivraisonResolverService,
                },
            },
            {
                path: DocumentPages.facture.urlSegment + '/:key',
                component: DocumentFactureComponent,
                resolve: {
                    document: FDocumentFactureResolverService,
                },
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FDocumentRoutingModule { }
