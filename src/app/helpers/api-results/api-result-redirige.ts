import { ApiResultErreur } from './api-result-erreur';

export class ApiResultRedirige extends ApiResultErreur {
    redirigeVers: string;
    constructor(statusCode: number, message: string, redirigeVers: string) {
        super(statusCode, message);
        this.redirigeVers = redirigeVers;
    }
}
