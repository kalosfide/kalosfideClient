import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisiteurExcluGuard } from './securite/visiteur-exclu.guard';
import { AppApiRoutes } from './app-api-routes';
import { DispositionComponent } from './disposition/disposition/disposition.component';
import { PageInterditeComponent } from './disposition/page-message/page-interdite.component';
import { PageIntrouvableComponent } from './disposition/page-message/page-introuvable.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DispositionComponent,
                children: [
                    {
                        path: AppApiRoutes.App.interdit,
                        component: PageInterditeComponent
                    },
                    {
                        path: AppApiRoutes.App.utilisateur,
                        loadChildren: './utilisateur/utilisateur.module#UtilisateurModule',
                    },
                    {
                        path: AppApiRoutes.App.compte,
                        loadChildren: './compte/compte.module#CompteModule'
                    },
                    {
                        path: AppApiRoutes.App.fournisseur,
                        loadChildren: './fournisseur/fournisseur.module#FournisseurModule'
                    },
                    {
                        path: AppApiRoutes.App.client,
                        loadChildren: './client/client.module#ClientModule'
                    },

                    {
                        path: 'siteinfo',
                        loadChildren: './site-info/site-info.module#SiteInfoModule'
                    },

                    {
                        path: '',
                        loadChildren: './visiteur/visiteur.module#VisiteurModule'
                    },

                    { path: '**', component: PageIntrouvableComponent },

                ]
            }
        ]
    }
];

@NgModule({

    imports: [
        RouterModule.forRoot(
            routes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],

    exports: [RouterModule]

})
export class AppRoutingModule { }
