import { ApiResultRedirige } from './api-result-redirige';

export class ApiResult403Forbidden extends ApiResultRedirige {
    static code = 403;

    constructor(redirigeVers: string) {
        super(403, 'L\'accès à ces ressources est réservé.', redirigeVers);
    }
}
