export class AnimeAttente {
    enCours: boolean;

    // identifiant du window.Timeout utilisé
    private IdTimeOut: number;

    // durée de vie du TimeOut
    private délai: number;

    // état du TimeOut
    private delaiTermine: boolean;

    constructor() {
        this.délai = 2; // KfParametres.délaiTimeOutParDefaut;
        this.delaiTermine = false;
    }

    private créeTimeOut() {
        if (this.IdTimeOut) {
            // il y a déjà un timeOut
            return;
        }

        // specify window.setTimeout to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
        this.IdTimeOut = window.setTimeout(() => this.quandDélaiTerminé(), this.délai);
    }

    private quandDélaiTerminé() {
        this.delaiTermine = true;
        this.détruitTimeOut();
    }

    private détruitTimeOut() {
        clearTimeout(this.IdTimeOut);
        this.IdTimeOut = undefined;
    }

    /**
     * appelée par un composant qui va lancer une action pour que le temporisateur soit visible si l'action dure trop
     */
    commence() {
        if (!this.enCours) {
            this.enCours = true;
            this.créeTimeOut();
        }
    }

    /**
     * appelée par ce composant quand l'action est terminée pour que le temporisateur ne soit plus visible
     */
    finit() {
        if (this.enCours) {
            this.enCours = false;
            if (this.delaiTermine) {
                // le TimeOut est déjà détruit
                this.delaiTermine = false;
            } else {
                this.détruitTimeOut();
            }
        }
    }

}

