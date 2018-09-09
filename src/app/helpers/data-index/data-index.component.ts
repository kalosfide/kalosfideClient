import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ApiResult } from '../api-results/api-result';
import { ApiResult200Ok } from '../api-results/api-result-200-ok';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';

@Component({
    selector: 'app-data-index',
    templateUrl: './data-index.component.html',
    styles: []
})
export class DataIndexComponent<T> implements OnInit {

    items$: Observable<T[]>;

    titre: string;
    avantTable: KfComposant;
    colonnes: string[];
    liste: () => Observable<ApiResult>;
    valeur: (item: T, colonne: string) => string;
    commandes: (item: T) => KfComposant[];

    constructor(
    ) {
    }

    ngOnInit() {
        this.items$ = this.liste()
            .pipe(take(1))
            .pipe(map(
                apiResult => {
                    if (apiResult.statusCode === 200) {
                        const lecture = (apiResult as ApiResult200Ok<T[]>).lecture;
                        if (lecture) {
                            return lecture;
                        }
                    }
                    return [];
                }
            ));
    }

}
