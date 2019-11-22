import { Observable, of, EMPTY } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { AfficheResultat } from '../disposition/affiche-resultat/affiche-resultat';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { ResultatAction } from '../disposition/affiche-resultat/resultat-affichable';
import { ApiErreur400Traite } from '../commun/api-results/api-erreur-400';

export class ApiRequêteAction {
    demandeApi: () => Observable<ApiResult>;
    actionSiOk: () => void;
    formulaire?: KfSuperGroupe;
    afficheResultat?: AfficheResultat;
    traiteErreur400?: () => ApiErreur400Traite[];
    actionSiErreur?: (resultat: ResultatAction) => void;
    titreErreur?: string;
    titreSucces?: string;
    avecAttenteGlobale?: boolean;
}
