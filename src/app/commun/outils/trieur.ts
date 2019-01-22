export interface ITri {
    nom: string;
    desc: boolean;
}
export class Tri<T> implements ITri {
    nom: string;
    desc: boolean;
    compare: (t1: T, t2: T) => number;

    constructor(nom: string, compare: (t1: T, t2: T) => number, desc?: boolean) {
        this.nom = nom;
        this.compare = compare;
        this.desc = desc;
    }

    trie(liste: T[]): T[] {
        liste = liste.sort(this.compare);
        if (this.desc === undefined) {
            this.desc = true;
        } else {
            if (this.desc === true) {
                liste = liste.reverse();
            }
            this.desc = !this.desc;
        }
        return liste;
    }

    trieDérivés<TDérivé>(liste: TDérivé[], t: (td: TDérivé) => T): TDérivé[] {
        let l = liste.sort((d1: TDérivé, d2: TDérivé): number => this.compare(t(d1), t(d2)));
        if (this.desc === undefined) {
            this.desc = true;
        } else {
            if (this.desc === true) {
                l = l.reverse();
            }
            this.desc = !this.desc;
        }
        return l;
    }
}
export class Filtre<T> {
    nom: string;
    valide: (t: T) => boolean;

    constructor(nom: string, valide: (t: T) => boolean) {
        this.nom = nom;
        this.valide = valide;
    }
}
export class Trieur<T> {
    private _tris: Tri<T>[] = [];
    private _filtres: Filtre<T>[] = [];
    private _dernierTri: Tri<T>;

    ajouteTri(tri: Tri<T>) {
        if (!this._tris) {
            this._tris = [tri];
            return;
        }
        const index = this._tris.findIndex(t => tri.nom === t.nom);
        if (index === -1) {
            this._tris.push(tri);
        } else {
            this._tris[index] = tri;
        }
    }

    private _supprime(nom: string, liste: any[]) {
        const trouve = liste.findIndex(tri => tri.nom === nom);
        if (trouve !== -1) {
            liste.splice(trouve, 1);
        }
    }

    supprimeTri(nom: string) {
        if (!this._tris) { return; }
        this._supprime(nom, this._tris);
    }

    ajouteFiltre(nom: string, valide: (item: T) => boolean) {
        const filtre = new Filtre(nom, valide);
        if (!this._filtres) {
            this._filtres = [filtre];
            return;
        }
        const index = this._filtres.findIndex(f => filtre.nom === f.nom);
        if (index === -1) {
            this._filtres.push(filtre);
        } else {
            this._filtres[index] = filtre;
        }
    }

    supprimeFiltre(nom: string) {
        if (!this._filtres) { return; }
        this._supprime(nom, this._filtres);
    }

    initialise(liste: T[]): T[] {
        let l = liste;
        this._tris.forEach(tri => {
            l = tri.trie(l);
        });
        return l;
    }

    trie(nomTri: string, liste: T[]): T[] {
        const tri = this._tris.find(t => t.nom === nomTri);
        if (tri) {
            liste = tri.trie(liste);
            tri.desc = tri.desc === undefined ? true : !tri.desc;
            this._dernierTri = tri;
        }
        return liste;
    }

    get dernierTri(): Tri<T> {
        return this._dernierTri;
    }

    filtre(liste: T[]): T[] {
        this._filtres.forEach(filtre => {
            liste = liste.filter(filtre.valide);
        });
        return liste;
    }
}
