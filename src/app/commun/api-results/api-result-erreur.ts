import { ApiResult } from './api-result';
import { AppPages } from 'src/app/app-pages';

export class ApiResultErreur extends ApiResult {
    message: string;
    constructor(statusCode: number, message: string) {
        super(statusCode);
        this.routeErreur = [AppPages.apiErreur.urlSegment];
        this.paramRouteErreur = { statusCode: statusCode, message: message };
        this.message = message;
    }
}
