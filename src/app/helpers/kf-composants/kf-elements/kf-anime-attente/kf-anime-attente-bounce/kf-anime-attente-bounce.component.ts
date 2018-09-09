import { Component, OnDestroy } from '@angular/core';
import { KfAnimeAttenteBounce } from './kf-anime-attente-bounce';
import { KfComposantComponent } from '../../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-anime-attente-bounce',
    templateUrl: './kf-anime-attente-bounce.component.html',
    styleUrls: ['./kf-anime-attente-bounce.component.scss']
})

export class KfAnimeAttenteBounceComponent extends KfComposantComponent implements OnDestroy {
    get animeAttente(): KfAnimeAttenteBounce {
        return this.composant as KfAnimeAttenteBounce;
    }

    ngOnDestroy(): any {
        this.animeAttente.finit();
    }
}
