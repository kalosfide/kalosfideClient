import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {
    erreurDeRoute: string;

    get routeAppIntrouvable() {
        return ['/introuvable'];
    }
}
