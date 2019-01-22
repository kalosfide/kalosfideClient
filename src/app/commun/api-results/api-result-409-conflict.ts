import { ApiResult } from './api-result';
import { AppRoutes, AppPages } from 'src/app/app-pages';

export class ApiResult409Conflict extends ApiResult {
    static code = 409;

    constructor(
    ) {
        super(409, [AppRoutes.url([AppPages.conflit.urlSegment])]);
    }
}
