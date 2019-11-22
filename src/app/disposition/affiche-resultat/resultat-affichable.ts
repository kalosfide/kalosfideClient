import { TypeResultatAffichable } from './type-resultat-affichable';
import { ApiResult } from 'src/app/commun/api-results/api-result';

export interface IResultatAffichable {
    typeAlert: TypeResultatAffichable;
    titre: string;
    détails: string[];
}

export class ResultatAction implements IResultatAffichable {
    private _ok: boolean;
    private _titre: string;
    private _détails: string[];
    private _apiResultRedirige: ApiResult;
    private _apiResultTraite: ApiResult;

    private constructor() {
    }

    static afficheOk(titre: string, détails?: string[]): ResultatAction {
        const resultat = new ResultatAction();
        resultat._ok = true;
        resultat._titre = titre;
        resultat._détails = détails;
        return resultat;
    }

    static afficheErreur(titre: string, détails?: string[]): ResultatAction {
        const resultat = new ResultatAction();
        resultat._ok = false;
        resultat._titre = titre;
        resultat._détails = détails;
        return resultat;
    }

    static redirigeErreur(apiResultRedirige: ApiResult) {
        const resultat = new ResultatAction();
        resultat._apiResultRedirige = apiResultRedirige;
        return resultat;
    }

    static traiteErreur(apiResultTraite: ApiResult) {
        const resultat = new ResultatAction();
        resultat._apiResultTraite = apiResultTraite;
        return resultat;
    }

    get ok(): boolean {
        return this._ok;
    }
    get titre(): string {
        return this._titre;
    }
    get détails(): string[] {
        return this._détails;
    }
    get apiResultRedirige(): ApiResult {
        return this._apiResultRedirige;
    }
    get apiResultTraite(): ApiResult {
        return this._apiResultTraite;
    }

    get typeAlert(): TypeResultatAffichable {
        return this._ok ? 'success' : 'danger';
    }
}
