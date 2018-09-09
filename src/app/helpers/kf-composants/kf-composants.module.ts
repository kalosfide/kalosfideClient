import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KfTexteImageComponent } from './kf-partages/kf-texte-image';
import { KfComposantComponent } from './kf-composant/kf-composant.component';
import { KfBoutonComponent } from './kf-elements/kf-bouton/kf-bouton.component';
import { KfEtiquetteComponent } from './kf-elements/kf-etiquette/kf-etiquette.component';
import { KfCaseACocherComponent } from './kf-elements/kf-case-a-cocher/kf-case-a-cocher.component';
import { KfRadiosComponent } from './kf-elements/kf-radios/kf-radios.component';
import { KfListeDeroulanteComponent } from './kf-elements/kf-liste-deroulante/kf-liste-deroulante.component';
import { KfNombreComponent } from './kf-elements/kf-nombre/kf-nombre.component';
import { KfTexteComponent } from './kf-elements/kf-texte/kf-texte.component';
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
import { KfAnimeAttenteBounceComponent } from './kf-elements/kf-anime-attente/kf-anime-attente-bounce/kf-anime-attente-bounce.component';
import { KfAfficheResultatComponent } from './kf-elements/kf-affiche-resultat/kf-affiche-resultat.component';
import { DialogueModule } from '../dialogue/dialogue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OutilsModule,
    DialogueModule,
    KfComposantsRoutingModule,
  ],
  declarations: [
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
      KfNombreComponent,
      KfRadioComponent,
      KfRadiosComponent,
      KfTexteComponent,
      KfVueJsonComponent,
      KfDialogueComponent,
      KfAfficheResultatComponent,
      KfAnimeAttenteBounceComponent,
  ],
  providers: [
      KfDialogueService,
  ],
  exports: [
      KfTexteImageComponent,
      KfComposantComponent
  ]
})
export class KfComposantsModule { }
