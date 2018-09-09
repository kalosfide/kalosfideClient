import { KfAnimeAttente } from './kf-anime-attente';
import { KfAnimeAttenteBounce } from './kf-anime-attente-bounce/kf-anime-attente-bounce';

export enum KfTypeAnimeAttente {
    Bounce = 'Bounce'
}

export class KfAnimeAttenteFabrique {
    static CréeAnimeAttente(nom: string, type: KfTypeAnimeAttente): KfAnimeAttente {
        switch (type) {
            case KfTypeAnimeAttente.Bounce:
                return new KfAnimeAttenteBounce(nom);
            default:
                return new KfAnimeAttenteBounce(nom);
        }
    }
}
