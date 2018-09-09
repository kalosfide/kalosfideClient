import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteInfoIndexComponent } from './site-info-index.component';
import { SiteInfoAjouteComponent } from './site-info-ajoute.component';
import { SiteInfoEditeComponent } from './site-info-edite.component';
import { SiteInfoResolverService } from './site-info-resolver.service';
import { SiteInfoSupprimeComponent } from './site-info-supprime.component';
import { SiteInfoComponent } from './site-info.component';

const routes: Routes = [
    {
        path: '',
        component: SiteInfoComponent,
        children: [
            {
                path: '',
                component: SiteInfoIndexComponent
            },
            {
                path: 'ajouter',
                component: SiteInfoAjouteComponent
            },
            {
                path: 'editer/:id',
                component: SiteInfoEditeComponent,
                resolve: {
                    siteInfo: SiteInfoResolverService
                }
            },
            {
                path: 'supprimer/:id',
                component: SiteInfoSupprimeComponent,
                resolve: {
                    id: SiteInfoResolverService
                }
            }
        ]
    }
];

@NgModule({

    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]

})
export class SiteInfoRoutingModule { }
