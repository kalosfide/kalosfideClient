export class DateFr {
    année: number;
    mois: number;
    jour: number;
    heure: number;
    minute: number;
    seconde: number;
    milliseconde: number;

    constructor() {
        this.date = new Date();
    }

    get date(): Date {
        return new Date(this.année, this.mois, this.jour, this.heure, this.minute, this.seconde, this.milliseconde);
    }
    set date(date: Date) {
        this.année = date.getFullYear();
        this.mois = date.getMonth();
        this.jour = date.getDate();
        this.heure = date.getHours();
        this.minute = date.getMinutes();
        this.seconde = date.getSeconds();
        this.milliseconde = date.getMilliseconds();
    }

    // ISO YYYY-MM-DDTHH:mm:ss.sssZ
    get texteDate(): string {
        return this.date.toISOString().substr(0, 10);
    }
    set texteDate(v: string) {
        const isoDate = v ? v : (new Date(0)).toISOString().substr(0, 10);
        const isoAprèsDate = this.date.toISOString().substring(11);
        try {
            this.date = new Date(isoDate + isoAprèsDate);
        } catch (error) {
            throw new Error('Date invalide');
        }
    }
    get texteTemps(): string {
        return this.date.toISOString().substr(11, 5);
    }
    set texteTemps(v: string) {
        const iso = this.date.toISOString();
        const isoAvantTemps = iso.substr(0, 11);
        const isoAprèsTemps = iso.substring(16);
        try {
            this.date = new Date(isoAvantTemps + v + isoAprèsTemps);
        } catch (error) {
            throw new Error('Temps invalide');
        }
    }
}
