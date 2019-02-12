export abstract class ApiResult {
    statusCode: number;
    routeErreur: any[];

    constructor(statusCode: number, routeErreur?: any[]) {
        this.statusCode = statusCode;
        this.routeErreur = routeErreur;
    }

}
