import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommunModule } from '../commun/commun.module';

import { MenuComponent } from './menu/menu.component';
import { ItemDeMenuComponent } from './item-de-menu/item-de-menu.component';
import { SousMenuComponent } from './sous-menu/sous-menu.component';
import { PiedComponent } from './pied/pied.component';
import { MenuConnectionComponent } from './menu-connection/menu-connection.component';
import { DispositionComponent } from './disposition/disposition.component';
import { PageInterditeComponent } from './page-message/page-interdite.component';
import { PageIntrouvableComponent } from './page-message/page-introuvable.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommunModule
    ],
    declarations: [
        MenuComponent,
        SousMenuComponent,
        ItemDeMenuComponent,
        MenuConnectionComponent,
        PiedComponent,
        DispositionComponent,
        PageInterditeComponent,
        PageIntrouvableComponent,
    ],
    exports: [
        DispositionComponent,
    ],
})
export class DispositionModule { }
