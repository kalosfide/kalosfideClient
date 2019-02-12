import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ModelesModule } from 'src/app/modeles/modeles.module';
import { SiteEditeComponent } from './site-edite.component';
import { SiteIndexComponent } from './site-index.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
    ],
    declarations: [
        SiteEditeComponent,
        SiteIndexComponent,
    ],
    providers: [
    ],
})
export class FSiteModule { }
