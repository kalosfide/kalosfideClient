/**
 * KfTypeDeComposant
 * Détermine l'Angular template qui rend le composant
*/
export enum KfTypeDeComposant {
    /**
     * elements (ie composants non conteneurs)
     *  le type est fixée dans le constructeur
     */
    /**
     * descriptifs (sans valeur)
     */
    aucun = 'aucun',
    bouton = 'bouton',
    etiquette = 'etiquette',
    image = 'image',
    vuejson = 'vue-json',
    lien = 'lien',
    fichierSauve = 'fichier-sauve',
    fichier = 'fichier',
    fichierCharge = 'fichier-charge',

    afficheResultat = 'affiche-resultat',
    animeAttenteBounce = 'anime-attente-bounce',
    /**
     * avec valeur
     */
    caseacocher = 'caseacocher',
    listederoulante = 'listederoulante',
    nombre = 'nombre',
    radio = 'radio',
    radios = 'radios',
    texte = 'texte',
    /**
     * conteneurs
     */
    groupe = 'groupe',
    liste = 'liste',
    listeEditeur = 'listeEditeur',
    menu = 'menu',
    sousmenu = 'sousmenu',
    dialogue = 'dialogue',
}

/**
 * Détermine l'Angular abstractControl et le type de la valeur du composant
*/
export enum KfTypeDeValeur {
    /**
     * elements descriptifs, menu, sous-menu (sans valeur)
     */
    aucun,
    /**
     * entrées (type de la valeur: boolean | number | string)
     */
    avecEntree,
    /**
     * liste (type de la valeur: any[])
     *  le type est fixé dans le constructeur
     */
    avecListe,
    /**
     * groupe (type de la valeur: any)
     *  le type fixé dans le constructeur devient aucun si tous les contenus sont de type aucun
     */
    avecGroupe,
}

export enum KfTypeDeBouton {
    bouton = 0,
    retablir,
    soumettre,
    annuler
}

export enum KfTypeDActionDeListe {
    ajouter = 'ajouter',
    editer = 'editer',
    monter = 'monter',
    descendre = 'descendre',
    supprimer = 'supprimer',
    effacerTout = 'effacerTout',
}

export enum KfKeyboardKey {
    enter = 'Enter',
    space = ' ',
    down = 'Down',
    left = 'Left',
    right = 'Right',
    up = 'Up',
    arrowDown = 'ArrowDown',
    arrowLeft = 'ArrowLeft',
    arrowRight = 'ArrowRight',
    arrowUp = 'ArrowUp',
    end = 'End',
    home = 'Home',
    pageDown = 'PageDown',
    pageUp = 'PageUp',
}

export enum KfTypeDeBaliseDEtiquette {
    aucun = 'aucun',
    span = 'span',
    div = 'div',
    P = 'P',
    pre = 'pre',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
}
