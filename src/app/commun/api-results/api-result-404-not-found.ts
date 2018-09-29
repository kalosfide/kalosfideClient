import { ApiResultErreur } from './api-result-erreur';

export class ApiResult404NotFound extends ApiResultErreur {
    static code = 404;
    
    constructor(
    ) {
        super(404, 'Les données demandées sont introuvables.');
    }
}
