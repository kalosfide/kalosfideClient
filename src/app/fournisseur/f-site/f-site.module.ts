import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunModule } from 'src/app/commun/commun.module';
import { DispositionModule } from 'src/app/disposition/disposition.module';

import { ModelesModule } from 'src/app/modeles/modeles.module';
import { SiteEditeComponent } from './site-edite.component';

@NgModule({
    imports: [
        CommonModule,
        CommunModule,
        DispositionModule,
        ModelesModule,
    ],
    declarations: [
        SiteEditeComponent,
    ],
    providers: [
    ],
})
export class FSiteModule { }
