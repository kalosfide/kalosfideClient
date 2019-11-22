import { FabriqueClasse } from './fabrique';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfTypeDEvenement, KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { FabriqueMembre } from './fabrique-membre';
import { KfVueTableOutils } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outils';
import { KfVueTableFiltreBase } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-base';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Couleur } from './fabrique-couleurs';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';

export class FabriqueVueTable extends FabriqueMembre {

    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    get classeFondFiltre(): string {
        return this.fabrique.couleur.classeCouleurFond(Couleur.beige);
    }

    get classeFondFiltreInactif(): string {
        return this.fabrique.couleur.classeCouleurFond(Couleur.whitesmoke);
    }

    vueTable<T>(nom: string, vueTableDef: IKfVueTableDef<T>, classe?: string): KfVueTable<T> {
        const vueTable = new KfVueTable(nom + '_table', vueTableDef);
        vueTable.ajouteClasseDef('table-sm table-hover');
        vueTable.ajouteClasseEnTete('thead-light');
        vueTable.ajouteClasseBilan('thead-light');
        if (classe !== null) {
            if (classe === undefined) {
                classe = 'align-middle';
            }
            vueTable.colonnes.forEach(colonne => {
                colonne.ajouteClasseItem(classe);
                if (colonne.enTeteDef) {
                    colonne.ajouteClasseEntete(classe);
                }
                if (colonne.bilanDef) {
                    colonne.ajouteClasseBilan(classe);
                }
            });
        }

        if (vueTable.outils) {
            vueTable.fixeClassesFiltre(this.classeFondFiltre);
            vueTable.outils.ajouteClasseDef('border border-rounded p-1 mb-2');
            vueTable.outils.fixeClassesFiltre(this.classeFondFiltre, this.classeFondFiltreInactif);
        }

        return vueTable;
    }

    outils<T>(nom: string): KfVueTableOutils<T> {
        const outils = new KfVueTableOutils<T>();
        outils.btnToolbar.ajouteClasseDef('justify-content-between');
        return outils;
    }

    private _prépareFiltreOuCherche<T>(filtre: KfVueTableFiltreBase<T>) {
        filtre.composant.gèreClasseEntree.ajouteClasseDef('input-group input-group-sm');
    }

    private _prépareFiltre<T>(filtre: KfVueTableFiltreTexte<T> | KfVueTableFiltreNombre<T>, titre: string, placeholder?: string) {
        this._prépareFiltreOuCherche<T>(filtre);
        filtre.composant.ajouteClasseDef('form-control-sm');
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.filtre }
        });
        fauxBouton.inactivité = true;
        filtre.liste.composantAvant = fauxBouton;
        if (placeholder) {
            const option0 = filtre.liste.créeOption0();
            option0.contenuPhrase.fixeTexte(placeholder);
            filtre.liste.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                (évènement: KfEvenement) => {
                    console.log(filtre.liste.valeur);
                    const estSur0 = filtre.liste.valeur === undefined;
                    if (estSur0) {
                        option0.contenuPhrase.fixeTexte(placeholder);
                        option0.supprimeClasseDef('font-italic');
                    } else {
                        option0.contenuPhrase.fixeTexte('Annuler le filtre');
                        option0.ajouteClasseDef('font-italic font-weight-bold');
                    }

                });
        }
        return filtre;
    }

    cherche<T>(nom: string, titre: string, texte: (t: T) => string, placeholder?: string): KfVueTableFiltreCherche<T> {
        const filtre = new KfVueTableFiltreCherche<T>(nom, texte);
        this._prépareFiltreOuCherche<T>(filtre);
        const fauxBouton = this.fabrique.bouton.bouton({
            nom: '',
            contenu: { nomIcone: this.fabrique.icone.nomIcone.cherche }
        });
        fauxBouton.inactivité = true;
        filtre.texte.composantAvant = fauxBouton;
        filtre.texte.créeBoutonEfface();
        filtre.texte.placeholder = placeholder;
        return filtre;
    }

    filtreTexte<T>(nom: string, titre: string, valide: (t: T, valeur: string) => boolean, placeholder?: string): KfVueTableFiltreTexte<T> {
        const filtre = new KfVueTableFiltreTexte<T>(nom, valide);
        this._prépareFiltre(filtre, titre, placeholder);
        return filtre;
    }

    filtreNombre<T>(nom: string, titre: string, valide: (t: T, valeur: number) => boolean, placeholder?: string)
        : KfVueTableFiltreNombre<T> {
        const filtre = new KfVueTableFiltreNombre<T>(nom, valide);
        this._prépareFiltre(filtre, titre, placeholder);
        return filtre;
    }

    outilAjoute<T>(lien: KfLien): KfVueTableOutilBtnGroupe<T> {
        const outilAjoute = new KfVueTableOutilBtnGroupe<T>('ajout', lien);
        outilAjoute.bbtnGroup.taille('sm');
        outilAjoute.bbtnGroup.ajouteClasseDef('ml-4');
        return outilAjoute;
    }

}
