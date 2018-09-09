import { ApiResult } from './api-result';

export class ApiResult400BadRequest extends ApiResult {
    static code = 400;

    validationErrors: { [keys: string]: string };
    constructor(
        validationErrors: { [keys: string]: string }
    ) {
        super(400);
        this.validationErrors = validationErrors;
    }
    get listeErreurs(): string[] {
        return Object.keys(this.validationErrors).map(key => key + ': ' + this.validationErrors[key]);
    }
}
