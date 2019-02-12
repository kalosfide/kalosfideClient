import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfLien } from '../../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { KfTypeResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-type-resultat-affichable';
import { KfResultatAffichable } from 'src/app/commun/kf-composants/kf-elements/kf-affiche-resultat/kf-resultat-affichable';
import { delay, map } from 'rxjs/operators';
import { ApiResult400BadRequest } from 'src/app/commun/api-results/api-result-400-bad-request';
import { FormulaireFabrique } from './formulaire-fabrique';
import { RouteurService } from 'src/app/services/routeur.service';

export interface IFormulaireBase {
    nom: string;

    afficheResultat?: KfAfficheResultat;
    lienRetour?: KfLien;
    boutonSoumettre: KfBouton;
    formulaire: KfSuperGroupe;
}

export class SoumissionDef {
    nom: string;
    créeEdition: () => KfGroupe;
    créeBoutonsDeFormulaire?: (formulaire: KfSuperGroupe) => KfBouton[];
    soumission?: () => Observable<ApiResult>;
    actionSiOk?: () => void;
    actionSiErreur?: (resultat: KfResultatAffichable) => void;
    lienRetour?: KfLien;
    titreErreur?: string;
    titreSucces?: string;
}

export class FormulaireASoumettre {
    soumission: () => Observable<ApiResult>;
    actionSiOk: () => void;
    edition: KfGroupe;
    formulaire: KfSuperGroupe;
    afficheResultat?: KfAfficheResultat;
    actionSiErreur?: (resultat: KfResultatAffichable) => void;
    titreErreur?: string;
    titreSucces?: string;
}

export function créeFormulaireASoumettre(def: SoumissionDef): FormulaireASoumettre {
    const formulaire = new KfSuperGroupe(def.nom);
    const edition = def.créeEdition();
    if (edition.gereValeur) {
        formulaire.créeGereValeur();
        formulaire.sauveQuandChange = true;
    }
    formulaire.ajoute(edition);
    let afficheResultat: KfAfficheResultat;
    if (def.créeBoutonsDeFormulaire) {
        formulaire.ajouteBoutonsDeFormulaire(def.créeBoutonsDeFormulaire(formulaire));
        afficheResultat = FormulaireFabrique.AjouteAfficheResultat(formulaire);
    }
    FormulaireFabrique.AjouteLienRetour(formulaire, def.lienRetour);
    if (edition.gereValeur) {
        formulaire.quandTousAjoutés();
    }
    return {
        soumission: def.soumission,
        actionSiOk: def.actionSiOk,
        actionSiErreur: def.actionSiErreur,
        edition: edition,
        formulaire: formulaire,
        afficheResultat: afficheResultat,
        titreErreur: def.titreErreur,
        titreSucces: def.titreSucces,
    };
}

function resultatSoumission(result: ApiResult, formulaireASoumettre: FormulaireASoumettre, routeur: RouteurService): KfResultatAffichable {
    if (!result) {
        return null;
    }
    const formulaire = formulaireASoumettre.formulaire;
    const titreSucces = formulaireASoumettre.titreSucces ? formulaireASoumettre.titreSucces : '';
    const titreErreur = formulaireASoumettre.titreErreur ? formulaireASoumettre.titreErreur : '';
    let resultat: KfResultatAffichable;
    switch (result.statusCode) {
        case 200:
        case 201:
        case 204:
            resultat = new KfResultatAffichable(KfTypeResultatAffichable.Ok, titreSucces);
            return resultat;
        case 400:
            resultat = new KfResultatAffichable(KfTypeResultatAffichable.Echec);
            if (formulaire) {
                const validationErrors = (result as ApiResult400BadRequest).validationErrors;
                const mesErreurs = formulaire.gereValeur.distribueValidationErrors(validationErrors);
                const details = formulaire.gereValeur.messages(mesErreurs);
                if (details.length > 0) {
                    resultat.titre = titreErreur + ': ' + details.shift();
                    resultat.détails = details;
                } else {
                    resultat.titre = titreErreur;
                }
            } else {
                resultat.titre = titreErreur;
            }
            return resultat;
        default:
            routeur.navigue(result.routeErreur);
            return null;
    }
}

export function soumet(
    attenteAsyncService: AttenteAsyncService,
    formulaireASoumettre: FormulaireASoumettre,
    routeur: RouteurService
) {
    attenteAsyncService.commence();
    if (formulaireASoumettre.afficheResultat) {
        formulaireASoumettre.afficheResultat.commence();
    }
    const subscription = formulaireASoumettre.soumission().pipe(
        delay(0),
        map((result: ApiResult): KfResultatAffichable => resultatSoumission(result, formulaireASoumettre, routeur)
        )
    ).subscribe(
        resultat => {
            subscription.unsubscribe();
            attenteAsyncService.finit();
            if (!resultat) {
                return;
            }
            if (resultat.type === KfTypeResultatAffichable.Ok) {
                formulaireASoumettre.actionSiOk();
                if (formulaireASoumettre.afficheResultat) {
                    formulaireASoumettre.afficheResultat.finit();
                }
            } else {
                if (formulaireASoumettre.actionSiErreur) {
                    formulaireASoumettre.actionSiErreur(resultat);
                }
                if (formulaireASoumettre.afficheResultat) {
                    formulaireASoumettre.afficheResultat.finit(resultat);
                }
            }
        }
    );
}
