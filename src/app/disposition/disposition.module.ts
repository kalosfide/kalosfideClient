import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { PiedComponent } from './pied/pied.component';
import { EtapeDeFormulaireComponent } from './formulaire/etape-de-formulaire.component';
import { FormulaireAEtapeResolverService } from './formulaire/formulaire-a-etapes-resolver.service';
import { FormulaireAEtapeService } from './formulaire/formulaire-a-etapes.service';
import { TitrePageComponent } from './titre-page/titre-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlerteComponent } from './alerte/alerte.component';
import { RetourEnHautComponent } from './retour-en-haut/retourne-en-haut.component';
import { NavBarComponent } from './navbars/navbar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule,
        NgbModule,
    ],
    declarations: [
        NavBarComponent,
        PiedComponent,
        TitrePageComponent,
        EtapeDeFormulaireComponent,
        AlerteComponent,
        RetourEnHautComponent,
    ],
    providers: [
        FormulaireAEtapeResolverService,
        FormulaireAEtapeService,
    ],
    exports: [
        NavBarComponent,
        TitrePageComponent,
        PiedComponent,
        AlerteComponent,
        RetourEnHautComponent,
    ],
})
export class DispositionModule { }
