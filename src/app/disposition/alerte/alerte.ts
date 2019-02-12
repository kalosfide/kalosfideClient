import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

export enum TypeAlerte {
    success,
    danger,
    info,
    warning
}

export class Alerte {
    id: string;
    contenu: KfEtiquette;
    type: TypeAlerte;
    fermable: boolean;
    fermetureAuto: number;
    nbNavigationAvantFermeture: number;

    get classe(): string {
        switch (this.type) {
            case TypeAlerte.success:
                return 'alert alert-success';
            case TypeAlerte.danger:
                return 'alert alert-danger';
            case TypeAlerte.info:
                return 'alert alert-info';
            case TypeAlerte.warning:
                return 'alert alert-warning';
        }
    }

}
