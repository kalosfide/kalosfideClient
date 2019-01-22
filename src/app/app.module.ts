import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { CommunModule } from './commun/commun.module';
import { ApiConfigService } from './services/api-config.service';
import { IdentificationService } from './securite/identification.service';
import { DispositionModule } from './disposition/disposition.module';
import { MotDePasseService } from './securite/mot-de-passe/mot-de-passe.service';
import { AttenteAsyncService } from './services/attenteAsync.service';
import { httpInterceptorProviders } from './services/http-interceptor-provider';
import { NavigationService } from './services/navigation.service';
import { SiteRoleGarde } from './securite/site-role-garde';
import { MotDePasseResolverService } from './securite/mot-de-passe/mot-de-passe-resolver.service';
import { ModelesModule } from './modeles/modeles.module';
import { SiteOuvertGarde } from './securite/site-ouvert-garde';
import { MessagesModule } from './messages/messages.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,

        CommunModule,
        DispositionModule,
        MessagesModule,
        ModelesModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        Title,
        ApiConfigService,
        AttenteAsyncService,
        NavigationService,
        IdentificationService,
        httpInterceptorProviders,
        NgbActiveModal,

        MotDePasseService,
        MotDePasseResolverService,
        SiteRoleGarde,
        SiteOuvertGarde
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
