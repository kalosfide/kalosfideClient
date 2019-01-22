import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { JwtIdentifiant, Identifiant } from './identifiant';
import { Stockage } from '../services/stockage';
import { SiteService } from '../modeles/site.service';

class IdentifiantStocké {
    jwt: JwtIdentifiant;
    utilisateur: Identifiant;
}

@Injectable({
    providedIn: 'root',
})
export class IdentificationService {

    private _stockage: Stockage<IdentifiantStocké>;

    private identificationAChangé = new Subject<boolean>();

    private _vientDenregistrer: boolean;

    constructor(
    ) {
        this._stockage = new Stockage('Identifiant',
            {
                distincts: (stock1: IdentifiantStocké, stock2: IdentifiantStocké): boolean => {
                    return !stock1.utilisateur.estIdentique(stock2.utilisateur);
                },
                action: () => {
                    this.identificationAChangé.next(true);
                }
            });
    }

    public get estAnonyme(): boolean {
        return this._stockage.estNull;
    }

    public get estIdentifié(): boolean {
        return !this.estAnonyme;
    }

    public get stockageIdentifiant(): IdentifiantStocké {
        if (this.estAnonyme) {
            return null;
        }
        return this._stockage.litStock();
    }

    public changementDIdentifiant(): Observable<boolean> {
        return this.identificationAChangé.asObservable();
    }

    public get jeton(): string {
        const identifiant = this.litJwtIdentifiant();
        return identifiant ? identifiant.Jeton : null;
    }

    private litJwtIdentifiant(): JwtIdentifiant {
        if (this.estAnonyme) {
            return null;
        }
        return this._stockage.litStock().jwt;
    }

    public litIdentifiant(): Identifiant {
        if (this.estAnonyme) {
            return null;
        }
        const utilisateur = this._stockage.litStock().utilisateur;
        const identifiant = new Identifiant();
        identifiant.copie(utilisateur);
        return identifiant;
    }

    public fixeIdentifiant(jwtIdentifiantSérialisé: string, utilisateur: Identifiant): void {
        const stock: IdentifiantStocké = {
            jwt: JSON.parse(jwtIdentifiantSérialisé) as JwtIdentifiant,
            utilisateur: utilisateur
        };
        this._stockage.fixeStock(stock);
    }

    public désérialiseIdentifiant(identifiantSérialisé: string): JwtIdentifiant {
        return JSON.parse(identifiantSérialisé) as JwtIdentifiant;
    }

    // fixé à vrai dans actionSiOk des Enregistrement...Component
    public get vientDEnregistrer(): boolean {
        return this._vientDenregistrer;
    }
    public set vientDEnregistrer(value: boolean) {
        this._vientDenregistrer = value;
    }

    public déconnecte(): void {
        this._stockage.fixeStock(undefined);
    }
}
