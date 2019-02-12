import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KfComposantsModule } from './kf-composants/kf-composants.module';
import { RouterModule } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { KfComposantComponent } from './kf-composants/kf-composant/kf-composant.component';
import { AnimeAttenteComponent } from './anime-attente/anime-attente.component';
import { PeutQuitterComponent } from './peut-quitter/peut-quitter.component';
import { PeutQuitterGarde } from './peut-quitter/peut-quitter-garde.service';
import { PeutQuitterService } from './peut-quitter/peut-quitter.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        KfComposantsModule,
    ],
    declarations: [
        AnimeAttenteComponent,
        PeutQuitterComponent,
    ],
    entryComponents: [
        PeutQuitterComponent
    ],
    providers: [
        RouteurService,
        PeutQuitterGarde,
        PeutQuitterService,
    ],
    exports: [
        KfComposantComponent,
        AnimeAttenteComponent,
    ]
})
export class CommunModule { }
