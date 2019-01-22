import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { MenuComponent } from './menu/menu.component';
import { ItemDeMenuComponent } from './item-de-menu/item-de-menu.component';
import { PiedComponent } from './pied/pied.component';
import { EtapeDeFormulaireComponent } from './formulaire/etape-de-formulaire.component';
import { FormulaireAEtapeResolverService } from './formulaire/formulaire-a-etapes-resolver.service';
import { FormulaireAEtapeService } from './formulaire/formulaire-a-etapes.service';
import { TitrePageComponent } from './titre-page/titre-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule
    ],
    declarations: [
        MenuComponent,
        ItemDeMenuComponent,
        PiedComponent,
        TitrePageComponent,
        EtapeDeFormulaireComponent,
    ],
    providers: [
        FormulaireAEtapeResolverService,
        FormulaireAEtapeService,
    ],
    exports: [
        MenuComponent,
        TitrePageComponent,
        PiedComponent,
    ],
})
export class DispositionModule { }
