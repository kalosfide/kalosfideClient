import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisiteurExcluGuard } from './sécurité/visiteur-exclu.guard';
import { PageIntrouvableComponent } from './helpers/page-message/page-introuvable.component';
import { PageInterditeComponent } from './helpers/page-message/page-interdite.component';
import { AppApiRoutes } from './app-api-routes';
import { PageComponent } from './disposition/page/page.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PageComponent,
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
