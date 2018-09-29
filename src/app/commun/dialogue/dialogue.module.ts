import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogueService } from './dialogue.service';
import { DialogueComponent } from './dialogue.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DialogueComponent,
    ],
    providers: [
        DialogueService,
    ],
    exports: [
        DialogueComponent,
    ]
})
export class DialogueModule { }
