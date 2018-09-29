import { ApiResultRedirige } from './api-result-redirige';

export class ApiResult401Unauthorized extends ApiResultRedirige {
    static code = 401;

    constructor(redirigeVers: string) {
        super(401, 'Vous n\'êtes pas connecté.', redirigeVers);
    }
}
