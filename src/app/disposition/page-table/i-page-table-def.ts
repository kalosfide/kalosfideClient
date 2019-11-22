import { Data } from '@angular/router';

export interface IPageTableDef<T> {
    avantChargeData?(): void;
    chargeData(data: Data): void;
    initialiseUtile?(): void;
    créeSuperGroupe(): void;
    chargeGroupe(): void;
    aprèsChargeData?(): void;
}
