import { ApiResultErreur } from './api-result-erreur';

export class ApiResult409Conflict extends ApiResultErreur {
    static code = 409;

    constructor(
    ) {
        super(409, 'Les données demandées sont verrouillées car en cours d\'utilisation.');
    }
}
