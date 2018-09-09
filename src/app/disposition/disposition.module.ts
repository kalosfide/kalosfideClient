import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HelpersModule } from '../helpers/helpers.module';

import { MenuComponent } from './menu/menu.component';
import { ItemDeMenuComponent } from './item-de-menu/item-de-menu.component';
import { SousMenuComponent } from './sous-menu/sous-menu.component';
import { PiedComponent } from './pied/pied.component';
import { MenuConnectionComponent } from './menu-connection/menu-connection.component';
import { PageComponent } from './page/page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HelpersModule
    ],
    declarations: [
        MenuComponent,
        SousMenuComponent,
        ItemDeMenuComponent,
        MenuConnectionComponent,
        PiedComponent,
        PageComponent,
        ItemDeMenuComponent,
    ],
    exports: [
        MenuComponent,
        MenuConnectionComponent,
        SousMenuComponent,
        PiedComponent,
        PageComponent,
    ],
})
export class DispositionModule { }
