import { Input, Component } from '@angular/core';

@Component({
    selector: 'app-titre-page',
    templateUrl: './titre-page.html',
    styles: []
})
export class TitrePageComponent {
@Input() titre: string;
}
