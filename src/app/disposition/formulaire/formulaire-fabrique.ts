import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { IFormulaireBase } from './i-formulaire';
import { KfAfficheResultat } from '../../commun/kf-composants/kf-elements/kf-affiche-resultat/kf-affiche-resultat';
import { KfTypeDeBouton } from '../../commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

export class FormulaireFabrique {

    static CréeBouton(nom: string, texte?: string): KfBouton {
        const bouton = new KfBouton(nom, texte);
        bouton.ajouteClasseDef('btn', 'btn-light');
        return bouton;
    }

    static NomBoutonSoumettre(formulaire: KfSuperGroupe): string {
        return formulaire.nom + '_soumettre';
    }
    static CréeBoutonSoumettre(formulaire: KfSuperGroupe, texte?: string): KfBouton {
        const bouton = new KfBouton(FormulaireFabrique.NomBoutonSoumettre(formulaire), texte);
        bouton.typeDeBouton = KfTypeDeBouton.soumettre;
        bouton.ajouteClasseDef('btn', 'btn-primary');
        return bouton;
    }

    static AjouteAfficheResultat(formulaire: KfSuperGroupe, groupeOùAjouter?: KfGroupe): KfAfficheResultat {
        const afficheResultat = new KfAfficheResultat(formulaire.nom + '_resultat');
        afficheResultat.visibiliteFnc =
            () => {
                const form = formulaire.formGroup;
                return form && form.pristine;
            };
        groupeOùAjouter = groupeOùAjouter ? groupeOùAjouter : formulaire;
        groupeOùAjouter.ajoute(afficheResultat);
        return afficheResultat;
    }

    static AjouteLienRetour(formulaire: KfSuperGroupe, lienRetour: KfLien) {
        if (lienRetour) {
            const groupe = new KfGroupe('');
            groupe.ajoute(lienRetour);
            formulaire.ajoute(groupe);
        }
    }
}
