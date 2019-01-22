import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AppPages, AppRoutes } from './app-pages';
import { AppSiteRoutes } from './app-site/app-site-pages';

const routes: Routes = [
    {
        path: '',
        redirectTo: AppPages.appSite.urlSegment,
        pathMatch: 'full',
    },
    {
        path: AppPages.appSite.urlSegment,
        loadChildren: './app-site/app-site.module#AppSiteModule'
    },
    {
        path: AppPages.site.urlSegment,
        loadChildren: './site/site.module#SiteModule'
    },
    {
        path: '**',
        redirectTo: AppRoutes.url([AppPages.appSite.urlSegment, AppPages.introuvable.urlSegment]),
    },
];

@NgModule({

    imports: [
        RouterModule.forRoot(
            routes,
            {
                preloadingStrategy: PreloadAllModules,
//                enableTracing: true // <-- debugging purposes only
            }
        )
    ],

    exports: [RouterModule]

})
export class AppRoutingModule { }
