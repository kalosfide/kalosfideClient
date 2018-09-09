import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteInfoService } from './site-info.service';
import { SiteInfoResolverService } from './site-info-resolver.service';
import { RouterModule } from '@angular/router';
import { SiteInfoComponent } from './site-info.component';
import { SiteInfoIndexComponent } from './site-info-index.component';
import { SiteInfoAjouteComponent } from './site-info-ajoute.component';
import { SiteInfoEditeComponent } from './site-info-edite.component';
import { SiteInfoSupprimeComponent } from './site-info-supprime.component';
import { HelpersModule } from '../helpers/helpers.module';
import { SiteInfoRoutingModule } from './site-info.routing.module';

@NgModule({
    imports: [
        CommonModule,
        SiteInfoRoutingModule,
        HelpersModule
    ],
    declarations: [
        SiteInfoComponent,
        SiteInfoIndexComponent,
        SiteInfoAjouteComponent,
        SiteInfoEditeComponent,
        SiteInfoSupprimeComponent,
    ],
    providers: [
        SiteInfoService,
        SiteInfoResolverService
    ],
})
export class SiteInfoModule { }
