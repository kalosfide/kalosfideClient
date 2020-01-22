import { IKeyUid } from './key-uid/i-key-uid';
import { IKeyUidRno } from './key-uid-rno/i-key-uid-rno';
import { IKeyUidRnoNo } from './key-uid-rno-no/i-key-uid-rno-no';
import { PageDef } from '../page-def';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { IDataKeyComponent } from './i-data-key-component';
import { IDataKey } from './data-key';

export abstract class DataKeyEditeur<T extends IDataKey> {
    protected _groupe: KfGroupe;
    protected _component: IDataKeyComponent;

    /**
     * vrai si la clé est générée par la base de données
     */
    keyAuto: boolean;
    /**
     * champs de Key
     */
    kfDeKey: KfComposant[];
    /**
     * champs éditables ou en lecture seule
     */
    kfDeData: KfComposant[];

    constructor(component: IDataKeyComponent) {
        this._component = component;
    }

    get pageDef(): PageDef {
        return this._component.pageDef;
    }

    protected abstract créeKfDeKey(): void;
    abstract fixeKfKey(key: IDataKey): void;
    protected abstract créeKfDeData(): void;

    protected ajouteChamps(...champs: KfComposant[]) {
        champs.forEach(c => this.kfDeData.push(c));
    }

    private prepareGroupe() {
        this._groupe.créeGereValeur();
        this.kfDeKey = [];
        this.créeKfDeKey();
        this.kfDeKey.forEach(c => this._groupe.ajoute(c));
        this.kfDeData = [];
        this.créeKfDeData();
        this.kfDeData.forEach(c => this._groupe.ajoute(c));
    }

    créeEdition(pageDef: PageDef) {
        this._groupe = new KfGroupe(pageDef.urlSegment);
        this.prepareGroupe();
    }
    get edition(): KfGroupe {
        return this._groupe;
    }
    get valeur(): T {
        return this._groupe.valeur;
    }
    fixeValeur(valeur: T) {
        console.log(this.edition);
        console.log(valeur, this.edition.valeur, this.edition.formGroup);
        this.edition.fixeValeur(valeur);
        /*
        */
    }

    créeSuperGroupe(): KfSuperGroupe {
        this._groupe = new KfSuperGroupe('');
        this.prepareGroupe();
        const superGroupe = this._groupe as KfSuperGroupe;
        superGroupe.quandTousAjoutés();
        return superGroupe;
    }
    get superGroupe(): KfSuperGroupe {
        return this._groupe as KfSuperGroupe;
    }

}
