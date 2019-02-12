import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { MenuComponent } from './menus/menu.component';
import { ItemDeMenuComponent } from './menus/item-de-menu.component';
import { PiedComponent } from './pied/pied.component';
import { EtapeDeFormulaireComponent } from './formulaire/etape-de-formulaire.component';
import { FormulaireAEtapeResolverService } from './formulaire/formulaire-a-etapes-resolver.service';
import { FormulaireAEtapeService } from './formulaire/formulaire-a-etapes.service';
import { TitrePageComponent } from './titre-page/titre-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlerteComponent } from './alerte/alerte.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule,
        NgbModule,
    ],
    declarations: [
        MenuComponent,
        ItemDeMenuComponent,
        PiedComponent,
        TitrePageComponent,
        EtapeDeFormulaireComponent,
        AlerteComponent,
    ],
    providers: [
        FormulaireAEtapeResolverService,
        FormulaireAEtapeService,
    ],
    exports: [
        MenuComponent,
        TitrePageComponent,
        PiedComponent,
        AlerteComponent,
    ],
})
export class DispositionModule { }
