import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { map, delay, take } from 'rxjs/operators';
import { ApiResult200Ok } from 'src/app/commun/api-results/api-result-200-ok';

export abstract class DevenirService extends DataService {

    public controllerUrl = ApiController.enregistrement;

    userNamePris(userName: string): Observable<boolean> {
        return this.get<boolean>(this.controllerUrl, ApiAction.enregistrement.userNamePris, userName).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }

    emailPris(email: string): Observable<boolean> {
        return this.get<boolean>(this.controllerUrl, ApiAction.enregistrement.emailPris, email).pipe(
            take(1),
            map(apiResult => apiResult.statusCode === ApiResult200Ok.code && (apiResult as ApiResult200Ok<boolean>).lecture)
        );
    }
}
