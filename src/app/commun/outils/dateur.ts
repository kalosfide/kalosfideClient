import { DateFr } from './date-fr';

export const MINUTE_EN_MS = 60 * 1000;
export const HEURE_EN_MS = 60 * 60 * 1000;
export const JOURNEE_EN_MS = 24 * 60 * 60 * 1000;

class DateurClasse {
     get maintenant(): Date {
         return new Date();
     }
     arrondiAuxMinutes(date: Date): Date {
        return new Date(Math.round(date.getTime() / MINUTE_EN_MS) * MINUTE_EN_MS);
    }
     ajouteHeures(date: Date, heures: number): Date {
        return new Date(date.getTime() + Math.round(heures * HEURE_EN_MS));
    }

     zéroHeure(date: Date): Date {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return d;
    }
     get aujourdhui0H(): Date {
        return this.zéroHeure(new Date(Date.now()));
    }
     get demain0H(): Date {
        const date = this.ajouteJours(this.aujourdhui0H, 1);
        return date;
    }
     get hier0H(): Date {
        const date = this.ajouteJours(this.aujourdhui0H, -1);
        return date;
    }
     ajouteJours(date: Date, jours: number): Date {
        return new Date(date.valueOf() + jours * JOURNEE_EN_MS);
    }
     joursDEcart(date1: Date, date2: Date): number {
        const d1 = this.zéroHeure(date1);
        const d2 = this.zéroHeure(date2);
        return Math.ceil((d1.valueOf() - d2.valueOf()) / JOURNEE_EN_MS);
    }

     estAujourdhui(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.aujourdhui0H.valueOf();
    }
     estDemain(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.demain0H.valueOf();
    }
     estHier(date: Date): boolean {
        return this.zéroHeure(date).valueOf() === this.hier0H.valueOf();
    }

     texteHMin(date: Date): string {
        const o: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
        };
        return date.toLocaleTimeString('fr-FR', o);
    }
     texteCourt(date: Date): string {
        const o: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        };
        return date.toLocaleString('fr-FR');
    }
     texteCourtHMin(date: Date): string {
        return this.texteCourt(date) + ' ' + this.texteHMin(date);
    }
     texteAujourdHui(date: Date): string {
        return this.estAujourdhui(date) ? `aujourd'hui` : this.texteCourt(date);
    }
     texteAujourdHuiDemain(date: Date): string {
        return this.estAujourdhui(date) ? `aujourd'hui`
            : this.estDemain(date) ? 'demain'
            : this.estHier(date) ? 'hier'
            : this.texteCourt(date);
    }
     texteAujourdHuiHMin(date: Date): string {
        return this.texteAujourdHui(date) + ' ' + this.texteHMin(date);
    }
     texteAujourdHuiDemainHMin(date: Date): string {
        return this.texteAujourdHuiDemain(date) + ' ' + this.texteHMin(date);
    }

    // ISO YYYY-MM-DDTHH:mm:ss.sssZ
    InputDateValue(date: Date): string {
        return date.toISOString().substr(0, 10);
    }
    InputTimeValue(date: Date): string {
        return date.toLocaleTimeString().substr(0, 5);
    }
    InputValueToDate(inputDateValue?: string, inputTimeValue?: string): Date {
        const iso = (new Date()).toISOString();
        const date = inputDateValue ? inputDateValue : iso.substr(0, 10);
        const hmin = (inputTimeValue ? inputTimeValue : iso.substr(11, 5)) + ':00.000';
        const z = iso.substring(11 + 12);
        console.log(iso, date + 'T' + hmin + z);
        return new Date(date + 'T' + hmin + z);
    }
}

export const Dateur = new DateurClasse();
