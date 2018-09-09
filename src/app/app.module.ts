import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { HelpersModule } from './helpers/helpers.module';
import { AppConfigService } from './services/app-config.service';
import { IdentificationService } from './sécurité/identification.service';
import { SiteInfoService } from './site-info/site-info.service';
import { DispositionModule } from './disposition/disposition.module';
import { MotDePasseService } from './helpers/mot-de-passe/mot-de-passe.service';
import { VisiteurExcluGuard } from './sécurité/visiteur-exclu.guard';
import { AutreService } from './services/autre.service';
import { MenuService } from './menus/menu.service';
import { QueClientGuard } from './sécurité/que-client.guard';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,

        HelpersModule,
        DispositionModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        Title,
        AppConfigService,
        MotDePasseService,
        IdentificationService,
        VisiteurExcluGuard,
        QueClientGuard,
        MenuService,

        AutreService,
        SiteInfoService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
