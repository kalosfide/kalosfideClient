export class ApiResult {
    statusCode: number;
    ok: boolean;
    routeErreur: string[];
    routeErreurAbsolue: boolean;
    paramRouteErreur: any;
    traite: () => void;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

}
