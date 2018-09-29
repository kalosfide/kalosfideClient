import { Component, OnDestroy } from '@angular/core';
import { KfAfficheResultat } from './kf-affiche-resultat';
import { KfTypeResultatAffichable } from './kf-type-resultat-affichable';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';

@Component({
    selector: 'app-kf-affiche-resultat',
    templateUrl: './kf-affiche-resultat.component.html',
    styleUrls: []
})

export class KfAfficheResultatComponent extends KfComposantComponent implements OnDestroy {
    get afficheResultat(): KfAfficheResultat {
        return this.composant as KfAfficheResultat;
    }

    get messageResultat(): string {
        if (this.afficheResultat.resultat) {
            return this.afficheResultat.resultat.titre;
        }
    }

    get detailsResultat(): string[] {
        if (this.afficheResultat.resultat) {
            return this.afficheResultat.resultat.détails ? this.afficheResultat.resultat.détails : [];
        }
    }

    get classeResultat(): string {
        if (this.afficheResultat.resultat) {
            switch (this.afficheResultat.resultat.type) {
                case KfTypeResultatAffichable.Avertissement:
                    return 'alert alert-warning';
                case KfTypeResultatAffichable.Echec:
                    return 'alert alert-danger';
                case KfTypeResultatAffichable.Ok:
                    return 'alert alert-success';
                default:
                    break;
            }
        }
        return '';
    }

    ngOnDestroy(): any {
        this.afficheResultat.finit();
    }
}
