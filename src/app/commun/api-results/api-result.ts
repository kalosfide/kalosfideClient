import { Observable } from 'rxjs';

export class ApiResult {
    statusCode: number;
    ok: boolean;
    routeErreur: string[];
    routeErreurAbsolue: boolean;
    paramRouteErreur: any;
    traite: () => void;
    traiteObs: () => Observable<boolean>;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

}
