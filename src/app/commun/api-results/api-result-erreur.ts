import { ApiResult } from './api-result';
import { AppRoutes, AppPages } from 'src/app/app-pages';

export class ApiResultErreur extends ApiResult {
    message: string;
    constructor(statusCode: number, message: string) {
        super(statusCode, [AppRoutes.url([AppPages.apiErreur.urlSegment]), { statusCode: statusCode, message: message }]);
        this.message = message;
    }
}
