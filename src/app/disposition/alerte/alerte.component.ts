import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Alerte, TypeAlerte } from './alerte';
import { AlerteService } from './alerte-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alerte',
    templateUrl: 'alerte.component.html',
    styleUrls: ['alerte.component.css'],
})

export class AlerteComponent implements OnInit, OnDestroy {

    alertes: Alerte[];

    subscription: Subscription;

    constructor(private alerteService: AlerteService) { }

    ngOnInit() {
        this.alertes = this.alerteService.alertes;
        this.subscription = this.alerteService.alertesChangé$().subscribe((changé: boolean) => {
            this.alertes = this.alerteService.alertes;
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ferme(alerte: Alerte) {
        this.alerteService.supprime(alerte.id);
    }
}
