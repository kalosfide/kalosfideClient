export const JOURNEE_EN_MS = 24 * 60 * 60 * 1000;

export class Dateur {
    static zéroHeure(date: Date): Date {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return d;
    }
    static get aujourdhui0H(): Date {
        return this.zéroHeure(new Date(Date.now()));
    }
    static get demain0H(): Date {
        const date = this.ajouteJours(this.aujourdhui0H, 1);
        return date;
    }
    static get hier0H(): Date {
        const date = this.ajouteJours(this.aujourdhui0H, -1);
        return date;
    }
    static ajouteJours(date: Date, jours: number): Date {
        return new Date(date.valueOf() + jours * JOURNEE_EN_MS);
    }
    static joursDEcart(date1: Date, date2: Date): number {
        const d1 = this.zéroHeure(date1);
        const d2 = this.zéroHeure(date2);
        return Math.ceil((d1.valueOf() - d2.valueOf()) / JOURNEE_EN_MS);
    }

    static estAujourdhui(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.aujourdhui0H.valueOf();
    }
    static estDemain(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.demain0H.valueOf();
    }
    static estHier(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.hier0H.valueOf();
    }

    static texteHMin(date: Date): string {
        const o: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
        };
        return date.toLocaleTimeString('fr-FR', o);
    }
    static texteCourt(date: Date): string {
        const o: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        };
        return date.toLocaleString('fr-FR');
    }
    static texteCourtHMin(date: Date): string {
        return this.texteCourt(date) + ' ' + this.texteHMin(date);
    }
    static texteAujourdHui(date: Date): string {
        return this.estAujourdhui(date) ? `aujourd'hui` : this.texteCourt(date);
    }
    static texteAujourdHuiDemain(date: Date): string {
        return this.estAujourdhui(date) ? `aujourd'hui`
            : this.estDemain(date) ? 'demain'
            : this.estHier(date) ? 'hier'
            : this.texteCourt(date);
    }
    static texteAujourdHuiHMin(date: Date): string {
        return this.texteAujourdHui(date) + ' ' + this.texteHMin(date);
    }
    static texteAujourdHuiDemainHMin(date: Date): string {
        return this.texteAujourdHuiDemain(date) + ' ' + this.texteHMin(date);
    }
}
