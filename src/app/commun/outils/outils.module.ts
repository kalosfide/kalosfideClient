import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitFichierTexteService } from './lit-fichier-texte.service';
import { PeutQuitterGarde } from './peut-quitter-garde.service';
import { PeutActiverGarde } from './peut-activer-garde';

@NgModule({
  declarations: [
  ],
  imports: [
      CommonModule,
  ],
  providers: [
      LitFichierTexteService,
      PeutActiverGarde,
      PeutQuitterGarde,
  ],
})
export class OutilsModule { }
