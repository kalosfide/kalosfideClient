import { Site } from '../modeles/site';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { AppRoutes } from '../app-pages';
import { SiteRoutes } from '../site/site-pages';
import { TypesRoles } from './type-role';

export class JwtIdentifiant {
    Id: string;
    Jeton: string;
    ExpireDans: number;
}
export class IdentifiantRole {
    rno: number;
    etat: string;
    nomSite: string;

    estIdentique(role: IdentifiantRole): boolean {
        return this.rno === role.rno
            && this.etat === role.etat
            && this.nomSite === role.nomSite;
    }

    copie(role: IdentifiantRole) {
        this.rno = role.rno;
        this.etat = role.etat;
        this.nomSite = role.nomSite;
    }
}
export class Identifiant {
    userId: string;
    userName: string;
    uid: string;
    etat: string;
    roles: IdentifiantRole[];
    sites: Site[];

    static keyEnCours(identifiant: Identifiant, siteEnCours: Site): KeyUidRno {
        return identifiant.estUsager(siteEnCours) ? {
            uid: identifiant.uid,
            rno: identifiant.roles.find(r => r.nomSite === siteEnCours.nomSite).rno
        } : null;
    }

    private sansRole(identifiant: Identifiant): any {
        return {
            userId: this.userId,
            userName: this.userName,
            uid: this.uid,
            etat: this.etat,
            roles: this.roles
        };
    }

    estIdentique(identifiant: Identifiant): boolean {
        return JSON.stringify(this.sansRole(this)) === JSON.stringify(this.sansRole(identifiant));
    }

    copie(identifiant: Identifiant) {
        this.userId = identifiant.userId;
        this.userName = identifiant.userName;
        this.uid = identifiant.uid;
        this.etat = identifiant.etat;
        this.roles = identifiant.roles.map(r => {
            const role = new IdentifiantRole();
            role.copie(r);
            return role;
        });
        this.sites = identifiant.sites.map(s => {
            const site = new Site();
            site.copie(s);
            return site;
        });
    }

    get nomSiteParDéfaut(): string {
        if (this.sites.length > 0) {
            return this.sites[0].nomSite;
        } else {
            return this.roles[0].nomSite;
        }
    }

    estAdministrateur(): boolean {
        return this.roles.length === 0;
    }

    estUsager(site: Site): boolean {
        return !!this.roles.find(role => role.nomSite === site.nomSite);
    }

    estFournisseur(site: Site): boolean {
        return this.uid === site.uid;
    }

    roleClient(site: Site): IdentifiantRole {
        return this.uid !== site.uid ? this.roles.find(role => role.nomSite === site.nomSite) : undefined;
    }
    estClient(site: Site): boolean {
        return this.roleClient(site) !== undefined;
    }

    estUsagerDeNomSite(nomSite: string): boolean {
        return !!this.roles.find(role => role.nomSite === nomSite);
    }

    estFournisseurDeNomSite(nomSite: string): boolean {
        return !!this.sites.find(site => site.nomSite === nomSite);
    }

    estClientDeNomSite(nomSite: string): boolean {
        return this.estUsagerDeNomSite(nomSite) && !this.estFournisseurDeNomSite(nomSite);
    }
}
