import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RouteurService {
    erreurDeRoute: string;

    get routeAppIntrouvable() {
        return ['/introuvable'];
    }
}
