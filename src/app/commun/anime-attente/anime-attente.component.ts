import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AnimeAttente } from './anime-attente';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-anime-attente',
    templateUrl: './anime-attente.component.html',
    styleUrls: ['./anime-attente.component.scss']
})
export class AnimeAttenteComponent  implements OnInit, OnDestroy {
    @Input() animeAttente: AnimeAttente;

    subscription: Subscription;

    constructor(private attenteAsync: AttenteAsyncService) {}

    ngOnInit() {
        this.subscription = this.attenteAsync.attenteAsync$().subscribe(
            encours => {
                if (encours) {
                    this.animeAttente.commence();
                } else {
                    this.animeAttente.finit();
                }
            }
        );
    }

    ngOnDestroy(): any {
        this.subscription.unsubscribe();
        this.animeAttente.finit();
    }
}
