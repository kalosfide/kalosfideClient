import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KfComposantsModule } from './kf-composants/kf-composants.module';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { RouterModule } from '@angular/router';
import { HelpersService } from './helpers.service';
import { KfComposantComponent } from './kf-composants/kf-composant/kf-composant.component';
import { PageInterditeComponent } from './page-message/page-interdite.component';
import { PageIntrouvableComponent } from './page-message/page-introuvable.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    KfComposantsModule
  ],
  declarations: [
      FormulaireComponent,
      PageInterditeComponent,
      PageIntrouvableComponent,
    ],
    providers: [
        HelpersService,
    ],
    exports: [
      FormulaireComponent,
      KfComposantComponent,
    ]
})
export class HelpersModule { }
