import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { Observable } from 'rxjs';
import { ApiResult } from '../../commun/api-results/api-result';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

export abstract class EtapeDeFormulaire {
    parent: KfSuperGroupe;
    formulaire: KfSuperGroupe;
    suivante: EtapeDeFormulaire;
    précédente: EtapeDeFormulaire;

    abstract nom: string;
    abstract titreHtml: string;
    abstract titre: string;
    abstract chargeAsync: () => Observable<ApiResult>;
    abstract créeEdition: () => KfGroupe;

    get texteBoutonPrécedent(): string {
        if (this.précédente) {
            return this.précédente.titre;
        }
    }

    get texteBoutonSuivant(): string {
        if (this.suivante) {
            return this.suivante.titre;
        } else {
            return this.parent.texte;
        }
    }
}
