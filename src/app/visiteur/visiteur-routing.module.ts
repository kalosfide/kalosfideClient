import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VAccueilComponent } from './v-accueil.component';
import { VContactComponent } from './v-contact.component';
import { VAProposComponent } from './v-apropos.component';
import { EtapeDeFormulaireComponent } from '../disposition/formulaire/etape-de-formulaire.component';
import { DevenirClientComponent } from './devenir-client/devenir-client.component';
import { DevenirClientPages } from './devenir-client/devenir-client-pages';
import { MotDePasseResolverService } from '../securite/mot-de-passe/mot-de-passe-resolver.service';
import { VProduitsComponent } from './v-produits.component';
import { SiteCategoriesResolverService } from '../modeles/site-categories-resolver.service';
import { SiteProduitsResolverService } from '../modeles/site-produits-resolver.service';
import { AppPages } from '../app-pages';
import { SiteOuvertGarde } from '../securite/site-ouvert-garde';
import { PageInterditeComponent } from '../messages/page-interdite.component';
import { PageConflitComponent } from '../messages/page-conflit.component';
import { PageErreurComponent } from '../messages/page-erreur.component';
import { SitePasOuvertComponent } from '../messages/site-pas-ouvert.component';
import { VisiteurPages } from './visiteur-pages';
import { PageIntrouvableComponent } from '../messages/page-introuvable.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: VisiteurPages.accueil.urlSegment,
        pathMatch: 'full',
    },
    {
        path: VisiteurPages.accueil.urlSegment,
        component: VAccueilComponent,
    },
    {
        path: VisiteurPages.produits.urlSegment,
        component: VProduitsComponent,
        resolve: {
            liste: SiteProduitsResolverService,
            categories: SiteCategoriesResolverService,
        },
        canActivate: [SiteOuvertGarde]
    },
    {
        path: VisiteurPages.contact.urlSegment,
        component: VContactComponent,
    },
    {
        path: VisiteurPages.apropos.urlSegment,
        component: VAProposComponent,
    },
    {
        path: VisiteurPages.devenirClient.urlSegment,
        component: DevenirClientComponent,
        resolve: {
            motDePasse: MotDePasseResolverService,
        },
        children: [
            {
                path: '',
                redirectTo: DevenirClientPages.connection.urlSegment,
                pathMatch: 'full',
            },
            {
                path: DevenirClientPages.connection.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 0 }
            },
            {
                path: DevenirClientPages.profil.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 1 }
            },
            {
                path: DevenirClientPages.validation.urlSegment,
                component: EtapeDeFormulaireComponent,
                data: { index: 2 }
            },
            {
                path: '**',
                redirectTo: DevenirClientPages.connection.urlSegment,
                pathMatch: 'full',
            },
        ],
    },
    {
        path: AppPages.compte.urlSegment,
        loadChildren: '../compte/compte.module#CompteModule'
    },
    // pages d'erreur
    {
        path: AppPages.interdit.urlSegment,
        component: PageInterditeComponent
    },
    {
        path: AppPages.conflit.urlSegment,
        component: PageConflitComponent
    },
    {
        path: AppPages.apiErreur.urlSegment,
        component: PageErreurComponent,
    },
    {
        path: AppPages.pasOuvert.urlSegment,
        component: SitePasOuvertComponent,
    },
    {
        path: AppPages.introuvable.urlSegment,
        component: PageIntrouvableComponent,
    },
    {
        path: '**',
        redirectTo: AppPages.introuvable.urlSegment,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisiteurRoutingModule { }
