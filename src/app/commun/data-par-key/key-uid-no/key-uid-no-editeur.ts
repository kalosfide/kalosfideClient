import { DataChamp } from '../data-champ';
import { DataKeyEditeur } from '../data-key-editeur';
import { KfTexte } from '../../kf-composants/kf-elements/kf-texte/kf-texte';
import { KfNombre } from '../../kf-composants/kf-elements/kf-nombre/kf-nombre';
import { IKeyUidNo } from './i-key-uid-no';

export abstract class KeyUidNoEditeur extends DataKeyEditeur {

    protected _kfUtilisateurId: KfTexte;
    protected _kfNo: KfNombre;

    créeChampsKeys() {
        this.champsKeys = [];
        let champ: DataChamp;
        this._kfUtilisateurId =  new KfTexte('utilisateurId');
        champ = new DataChamp();
        champ.composant = this._kfUtilisateurId;
        this.champsKeys.push(champ);
        this._kfNo = new KfNombre('no');
        champ = new DataChamp();
        champ.composant = this._kfNo;
        this.champsKeys.push(champ);
    }
    fixeChampsKeys(key: IKeyUidNo) {
        this._kfUtilisateurId.fixeValeur(key.utilisateurId);
        this._kfNo.fixeValeur(key.no);
    }
}
