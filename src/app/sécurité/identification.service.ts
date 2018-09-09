import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { Identifiant, RevendicationsUtilisateur } from './identifiant';
import { AppApiRoutes } from '../app-api-routes';
import { TypeRole } from './type-role';
import { UtilisateurApiRoutes } from '../utilisateur/utilisateur-api-routes';

const NomStockage = 'Identifiant';

@Injectable()
export class IdentificationService {

    private _retourUrl: string;

    private identificationAChangé = new Subject<boolean>();

    private unp: { un: string; p: string; };

    constructor() {
        this.initialise();
    }

    public estAnonyme(): boolean {
        return window.localStorage[NomStockage] === undefined ||
            window.localStorage[NomStockage] === null ||
            window.localStorage[NomStockage] === 'null' ||
            window.localStorage[NomStockage] === 'undefined' ||
            window.localStorage[NomStockage] === '';
    }

    public estIdentifié(): boolean {
        return !this.estAnonyme();
    }

    public changementDIdentifiant(): Observable<boolean> {
        return this.identificationAChangé.asObservable();
    }

    public utilisateurId(): string {
        const identifiant = this.litIdentifiant();
        return identifiant ? identifiant.id : undefined;
    }

    public jeton(): string {
        const identifiant = this.litIdentifiant();
        return identifiant ? identifiant.jeton : undefined;
    }

    public litIdentifiant(): Identifiant {
        if (this.estAnonyme()) {
            return null;
        }
        return JSON.parse(window.localStorage[NomStockage]) as Identifiant;
    }

    public fixeIdentifiant(identifiant: Identifiant): void {
        this.setStorageToken(identifiant);
    }

    // navigation après connection
    public get retourUrl(): string {
        if (this._retourUrl) {
            return this._retourUrl;
        }
        const revendications: RevendicationsUtilisateur = this.litIdentifiant().revendications;
        if (revendications.roleNo === 0) {
            return UtilisateurApiRoutes.Route(UtilisateurApiRoutes.App.role);
        } else {
            switch (revendications.typeRole) {
                case TypeRole.administrateur.code:
                    return AppApiRoutes.Route(AppApiRoutes.App.administrateur);
                case TypeRole.fournisseur.code:
                    return AppApiRoutes.Route(AppApiRoutes.App.fournisseur);
                case TypeRole.client.code:
                    return AppApiRoutes.Route(AppApiRoutes.App.client);
                default:
                    break;
            }
        }
    }
    public set retourUrl(value: string) {
        this._retourUrl = value;
    }

    // Passage de enregistrement à connection
    public get vientDEnregistrer(): { un: string; p: string; } {
        return this.unp;
    }
    public fixeVientDEnregistrer(un?: string, p?: string) {
        if (un) {
            this.unp = {
                un: un,
                p: p
            };
        } else {
            this.unp = undefined;
        }
    }

    // Utilitaires
    public initialise(): void {
        this.setStorageToken(undefined);
    }

    public déconnecte(): void {
        this.setStorageToken(undefined);
    }

    private setStorageToken(identifiant: Identifiant): void {
        window.localStorage[NomStockage] = JSON.stringify(identifiant);
        this.identificationAChangé.next(this.estIdentifié());
    }

}
