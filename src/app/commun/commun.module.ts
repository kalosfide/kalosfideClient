import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KfComposantsModule } from './kf-composants/kf-composants.module';
import { RouterModule } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { KfComposantComponent } from './kf-composants/kf-composant/kf-composant.component';
import { AnimeAttenteComponent } from './anime-attente/anime-attente.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        KfComposantsModule
    ],
    declarations: [
        AnimeAttenteComponent,
    ],
    providers: [
        RouteurService,
    ],
    exports: [
        KfComposantComponent,
        AnimeAttenteComponent
    ]
})
export class CommunModule { }
