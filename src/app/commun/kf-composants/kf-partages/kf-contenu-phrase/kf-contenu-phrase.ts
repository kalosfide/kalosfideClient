import { KfTexteDef } from '../kf-texte-def';
import { KfTexte } from '../../kf-elements/kf-texte/kf-texte';
import { KfImage } from '../../kf-elements/kf-image/kf-image';
import { KfIcone } from '../../kf-elements/kf-icone/kf-icone';
import { KfLien } from '../../kf-elements/kf-lien/kf-lien';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfImageDef } from '../kf-image-def';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ValeurIconeDef } from '../kf-icone-def';

export type KfTypeContenuPhrasé = KfTexte | KfImage | KfIcone | KfLien;

/**
 * Phrasing content
 */
export class KfContenuPhrase {

    /**
     * composant propriétaire pour lui transmettre les évènements
     */
    composant: KfComposant;
    /**
     * contenus phrasés
     */
    contenus: KfTypeContenuPhrasé[] = [];

    enfantsDeVue: { [key: string]: HTMLElement };

    constructor(
        composant: KfComposant,
        texte?: KfTexteDef,
    ) {
        this.composant = composant;
        if (texte) {
            this.créeKfTexte(texte);
        }
    }

    ajoute(composant: KfTypeContenuPhrasé) {
        if (composant.typeDeComposant === KfTypeDeComposant.lien) {
            if (!composant.style) {
                composant.style = {};
            }
            composant.style['display'] = 'inline';
            composant.style['padding'] = '0';
        }
        this.contenus.push(composant);
    }

    private créeKfTexte(texteDef: KfTexteDef) {
        const t = new KfTexte(this.composant.nom + '_t', texteDef);
        this.contenus.push(t);
    }

    /**
     * retourne le texte du premier contenu qui est un KfTexte
     */
    get texte(): string {
        const kfTexte = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.texte) as KfTexte);
        if (kfTexte) {
            return kfTexte.texte;
        }
    }
    /**
     * fixe le texte du premier contenu qui est un KfTexte ou crée un contenu KfTexte
     */
    fixeTexte(texte: KfTexteDef) {
        const kfTexte = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.texte) as KfTexte);
        if (kfTexte) {
            kfTexte.texteDef = texte;
        } else {
            this.créeKfTexte(texte);
        }
    }

    private créeKfImage(imageDef: KfImageDef) {
        const t = new KfImage(this.composant.nom + '__img', imageDef);
        this.contenus.push(t);
    }

    /**
     * retourne l'imageDef du premier contenu qui est un KfImage
     */
    get imageDef(): KfImageDef {
        const kfImage = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.image) as KfImage);
        if (kfImage) {
            return kfImage.imageDef;
        }
    }
    /**
     * fixe l'imageDef du premier contenu qui est un KfImage ou crée un contenu KfImage
     */
    fixeImage(imageDef: KfImageDef) {
        const kfImage = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.image) as KfImage);
        if (kfImage) {
            kfImage.imageDef = imageDef;
        } else {
            this.créeKfImage(imageDef);
        }
    }

    private créeKfIcone(iconeDef: IconDefinition): KfIcone {
        const kfIcone = new KfIcone(this.composant.nom + '_t', iconeDef);
        this.contenus.push(kfIcone);
        return kfIcone;
    }

    /**
     * retourne l'icone du premier contenu qui est un KfIcone
     */
    get icone(): IconDefinition {
        const kfIcone = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.icone) as KfIcone);
        if (kfIcone) {
            return ValeurIconeDef(kfIcone.iconeDef);
        }
    }
    /**
     * fixe l'icone du premier contenu qui est un KfIcone ou crée un contenu KfIcone
     */
    fixeIcone(icone: IconDefinition): KfIcone {
        const kfIcone = (this.contenus.find(c => c.typeDeComposant === KfTypeDeComposant.icone) as KfIcone);
        if (kfIcone) {
            kfIcone.iconeDef = icone;
            return kfIcone;
        } else {
            return this.créeKfIcone(icone);
        }
    }

}
