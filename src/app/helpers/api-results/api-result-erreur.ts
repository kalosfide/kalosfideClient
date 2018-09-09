import { ApiResult } from './api-result';

export class ApiResultErreur extends ApiResult {
    message: string;
    constructor(statusCode: number, message: string) {
        super(statusCode);
        this.message = message;
    }
}
