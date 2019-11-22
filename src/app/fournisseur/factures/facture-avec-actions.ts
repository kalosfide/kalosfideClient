import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';

export interface IFactureAvecActions {
    anulleInactifIO: KfInitialObservable<boolean>;
    copieInactifIo: KfInitialObservable<boolean>;
    annule(): void;
    copie(): void;
}
