import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateValueAccessorModule } from 'angular-date-value-accessor';

import { KfComposantComponent } from './kf-composant/kf-composant.component';
import { KfBoutonComponent } from './kf-elements/kf-bouton/kf-bouton.component';
import { KfEtiquetteComponent } from './kf-elements/kf-etiquette/kf-etiquette.component';
import { KfCaseACocherComponent } from './kf-elements/kf-case-a-cocher/kf-case-a-cocher.component';
import { KfRadiosComponent } from './kf-elements/kf-radios/kf-radios.component';
import { KfListeDeroulanteComponent } from './kf-elements/kf-liste-deroulante/kf-liste-deroulante.component';
import { KfVueJsonComponent } from './kf-elements/kf-vue-json/kf-vue-json.component';
import { KfGroupeComponent } from './kf-groupe/kf-groupe.component';
import { KfListeComponent } from './kf-liste/kf-liste.component';
import { KfMenuComponent } from './kf-menu/kf-menu.component';
import { KfSousMenuComponent } from './kf-menu/kf-sous-menu.component';
import { KfRadioComponent } from './kf-elements/kf-radios/kf-radio.component';
import { KfFichierSauveComponent } from './kf-elements/kf-fichier-sauve/kf-fichier-sauve.component';
import { KfFichierChargeComponent } from './kf-elements/kf-fichier-charge/kf-fichier-charge.component';
import { KfFichierComponent } from './kf-elements/kf-fichier/kf-fichier.component';
import { KfListeEditeurComponent } from './kf-liste/kf-liste-editeur.component';
import { KfLienComponent } from './kf-elements/kf-lien/kf-lien.component';
import { KfComposantsRoutingModule } from './kf-composants-routing.module';
import { OutilsModule } from '../outils/outils.module';
import { KfDialogueComponent } from './kf-dialogue/kf-dialogue.component';
import { KfDialogueService } from './kf-dialogue/kf-dialogue.service';
import { KfAfficheResultatComponent } from './kf-elements/kf-affiche-resultat/kf-affiche-resultat.component';
import { KfVueTableComponent } from './kf-vue-table/kf-vue-table.component';
import { KfImageDefComponent } from './kf-partages/kf-image-def/kf-image-def.component';
import { KfTexteImageComponent } from './kf-partages/kf-texte-image/kf-texte-image.component';
import { KfUlComponent } from './kf-ul-li/kf-ul.component';
import { KfLiComponent } from './kf-ul-li/kf-li.component';
import { KfInputComponent } from './kf-elements/kf-input/kf-input.component';
import { KfInactifDirective } from './kf-partages/kf-inactif.directive';

@NgModule({
  imports: [
    CommonModule,
    DateValueAccessorModule,
    FormsModule,
    ReactiveFormsModule,
    OutilsModule,
    KfComposantsRoutingModule,
  ],
  declarations: [
      KfImageDefComponent,
      KfTexteImageComponent,
      KfComposantComponent,
      KfGroupeComponent,
      KfBoutonComponent,
      KfCaseACocherComponent,
      KfEtiquetteComponent,
      KfFichierComponent,
      KfFichierChargeComponent,
      KfFichierSauveComponent,
      KfLienComponent,
      KfListeComponent,
      KfListeEditeurComponent,
      KfListeDeroulanteComponent,
      KfMenuComponent,
      KfSousMenuComponent,
      KfInputComponent,
      KfRadioComponent,
      KfRadiosComponent,
      KfVueJsonComponent,
      KfDialogueComponent,
      KfAfficheResultatComponent,
      KfVueTableComponent,
      KfUlComponent,
      KfLiComponent,
      KfInactifDirective,
  ],
  providers: [
      KfDialogueService,
  ],
  exports: [
      KfImageDefComponent,
      KfTexteImageComponent,
      KfComposantComponent,
      KfInactifDirective,
  ]
})
export class KfComposantsModule { }
