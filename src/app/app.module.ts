import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { CommunModule } from './commun/commun.module';
import { ApiConfigService } from './services/api-config.service';
import { IdentificationService } from './securite/identification.service';
import { DispositionModule } from './disposition/disposition.module';
import { MotDePasseService } from './commun/mot-de-passe/mot-de-passe.service';
import { VisiteurExcluGuard } from './securite/visiteur-exclu.guard';
import { MenuService } from './menus/menu.service';
import { QueClientGuard } from './securite/que-client.guard';
import { TitreHtmlService } from './services/titreHtml.service';
import { AttenteAsyncService } from './services/attenteAsync.service';
import { SiteInfoStaticService } from './site-info/site-info-static.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,

        CommunModule,
        DispositionModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        Title,
        ApiConfigService,
        TitreHtmlService,
        AttenteAsyncService,
        IdentificationService,
        MenuService, // utilise IdentificationService
        MotDePasseService,
        VisiteurExcluGuard,
        QueClientGuard,

        SiteInfoStaticService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
