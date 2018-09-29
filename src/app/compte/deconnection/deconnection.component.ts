import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';
import { AttenteAsyncService } from '../../services/attenteAsync.service';
import { Subscription } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiResult204NoContent } from '../../commun/api-results/api-result-204-no-content';

@Component({
    selector: 'app-deconnection',
    templateUrl: './deconnection.component.html',
    styles: []
})
export class DeconnectionComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor(
        private router: Router,
        private service: UtilisateurService,
        private attenteAsync: AttenteAsyncService,
    ) { }

    ngOnInit() {
        this.attenteAsync.commence();
        this.subscription = this.service.déconnecte().subscribe(
            (apiResult: ApiResult) => {
                if (apiResult.statusCode === ApiResult204NoContent.code) {
                    this.attenteAsync.finit();
                }
                this.router.navigate(['/']);
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
